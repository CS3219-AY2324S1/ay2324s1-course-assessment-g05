import HttpStatusCode from "@/types/HttpStatusCode";
import { HTTP_METHODS } from "@/types/enums";
import { Judge0Status, judge0Request, judge0Response } from "@/types/judge0";
import { CodeExecutorUtils } from "@/utils/codeExecutorUtils";
import { getError, throwAndLogError } from "@/utils/errorUtils";

const codeExecPort = "2358";
const submissionsEndpointQueries = "?base64_encoded=true";

const submissionsEndpoint = `http://localhost:${codeExecPort}/submissions/`;

const executeCode = async (
  code: string,
  language: string,
  inputDict: { [variableName: string]: string }
) => {
  const languageId = CodeExecutorUtils.getJudge0LanguageId(language);
  const codeToExecute = CodeExecutorUtils.prepareCodeForExecution(
    inputDict,
    code,
    language
  );
  const base64SourceCode = Buffer.from(codeToExecute).toString("base64");
  // Do not send expected output because judge0 is inflexible with whitespace
  // We will compare the expected output with the actual output ourselves
  const submissionRequest: judge0Request = {
    language_id: languageId,
    source_code: base64SourceCode,
  };

  try {
    const response = await fetch(
      submissionsEndpoint + submissionsEndpointQueries,
      {
        method: HTTP_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionRequest),
      }
    );

    if (response.status === HttpStatusCode.CREATED) {
      const submissionId = (await response.json()).token;
      return submissionId;
    }

    throwAndLogError(
      "executeCode",
      await response.json(),
      getError(response.status)
    );
  } catch (e) {
    throw Error("Error executing code: " + e);
  }
};

const checkCodeExecutionStatus = async (submissionId: string) => {
  try {
    const response = await fetch(
      submissionsEndpoint + submissionId + "/" + submissionsEndpointQueries,
      {
        method: HTTP_METHODS.GET,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === HttpStatusCode.OK) {
      const statusId = (await response.clone().json()).status.id;

      if (
        statusId === Judge0Status.IN_QUEUE ||
        statusId === Judge0Status.PROCESSING
      ) {
        // Still processing, check again in 2 seconds
        setTimeout(() => checkCodeExecutionStatus(submissionId), 2000);
        return;
      } else {
        // Finished processing, return the status
        let judge0Response: judge0Response;
        const data = await response.clone().json();
        judge0Response = {
          stdout: data.stdout
            ? Buffer.from(data.stdout, "base64").toString("utf-8")
            : "",
          stderr: data.stderr
            ? Buffer.from(data.stderr, "base64").toString("utf-8")
            : "",
          compile_output: data.compile_output
            ? Buffer.from(data.compile_output, "base64").toString("utf-8")
            : "",
          message: data.message
            ? Buffer.from(data.message, "base64").toString("utf-8")
            : "",
          statusId: data.status && data.status.id,
          description: data.status && data.status.description,
        };
        return judge0Response;
      }
    }
  } catch (e) {
    throw Error("Error checking code execution status : " + e);
  }
};

export const CodeExecutionService = {
  executeCode,
  checkCodeExecutionStatus,
};
