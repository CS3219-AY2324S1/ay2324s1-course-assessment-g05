import Complexity from "../../lib/enums/Complexity";
import Language from "../../lib/enums/Language";
import { encodeEnum, encodePreferences } from "../../lib/utils/encoder"
import { testPreferences } from "../utils/payloads"

describe("encodeEnum", () => {
    it('Should return a matching encoded value in the correct sequence', () => {
        let enumToEncode = testPreferences[0].languages;
        let encodedString = encodeEnum(Language, enumToEncode);
        expect(encodedString).toBe('1100');

        enumToEncode = testPreferences[3].languages;
        encodedString = encodeEnum(Language, enumToEncode);
        expect(encodedString).toBe('0110');

        enumToEncode = testPreferences[0].difficulties;
        encodedString = encodeEnum(Complexity, enumToEncode);
        expect(encodedString).toBe('100');

        enumToEncode = testPreferences[2].difficulties;
        encodedString = encodeEnum(Complexity, enumToEncode);
        expect(encodedString).toBe('010');
    });

    it('Should return a matching encoded value regardless of order', () => {
        expect(
            encodeEnum(Language, testPreferences[0].languages)
        ).toBe(
            encodeEnum(Language, testPreferences[1].languages)
        );

        expect(
            encodeEnum(Complexity, testPreferences[0].difficulties)
        ).toBe(
            encodeEnum(Complexity, testPreferences[1].difficulties)
        );
    });

    it('Should not return a matching encoded value', () => {
        expect(
            encodeEnum(Language, testPreferences[0].languages)
        ).not.toBe(
            encodeEnum(Language, testPreferences[3].languages)
        );

        expect(
            encodeEnum(Complexity, testPreferences[0].difficulties)
        ).not.toBe(
            encodeEnum(Complexity, testPreferences[2].difficulties)
        );
    });
});

// describe("encodePreferences", () => {
//     it('Should return a matching preferenceId', () => {
        
//     })
// })