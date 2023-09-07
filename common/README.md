# /common Directory Usage

This `/common` directory **contain components that can be shared across different node projects**.

## Usage in node project
1. Add reference in `tsconfig.json`.
```json 
{
    "compilerOptions": {
        // The usual
    },
    "references": [
        { "path": "../common" }
    ]
}
```

2. Import components
```js
import Question from '../../common/types/question';
```