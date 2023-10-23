export const judge0Statuses = {
  0: "In Queue",
  1: "Processing",
  2: "Accepted",
  3: "Wrong Answer",
  4: "Time Limit Exceeded",
  5: "Compilation Error",
  6: "Runtime Error (SIGSEGV)",
  7: "Runtime Error (SIGXFSZ)",
  8: "Runtime Error (SIGFPE)",
  9: "Runtime Error (SIGABRT)",
  10: "Runtime Error (NZEC)",
  11: "Runtime Error (Other)",
  12: "Internal Error",
  13: "Exec Format Error",
};

// If it is custom test case, expected_output is "Not Available"
export type judge0Request = {
  language_id: number;
  source_code: string;
  expected_output?: string;
};

export type judge0Response = {
  stdout: string;
  stderr: string;
  compile_output: string;
  message: string;
  token: string;
  status: {
    id: number;
    description: string;
  };
};
