const fs = require('fs');
const path = require('path');

function createDirsAndFiles(name) {
    const lowerName = name.toLowerCase();
    const singularName = lowerName.slice(0, -1);
    const capitalizedSingularName = capitalizeFirstLetter(singularName);

    const parentDir = path.join(__dirname, lowerName);
    const directories = [
        'application',
        'domain',
        'infrastructure/db',
        'infrastructure/rest'
    ];

    const files = [
        { dir: 'application', file: `${lowerName}.usecases.ts`, content: generateUsecasesClassContent(lowerName, singularName) },
        { dir: 'domain', file: `${capitalizedSingularName}.ts`, content: generateInterfaceContent(capitalizedSingularName) },
        { dir: 'domain', file: `${lowerName}.repository.ts`, content: generateRepositoryInterfaceContent(lowerName, singularName) },
        { dir: 'infrastructure/db', file: `${lowerName}.repository.postgres.ts`, content: generateRepositoryPostgresClassContent(lowerName, capitalizedSingularName) },
        { dir: 'infrastructure/db', file: `${lowerName}.repository.mongo.ts`, content: generateRepositoryMongoClassContent(lowerName, capitalizedSingularName) },
        { dir: 'infrastructure/rest', file: `${lowerName}.rest.ts`, content: generateRestRouterContent(lowerName, singularName, capitalizedSingularName) },
    ];

    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
    }

    directories.forEach((dir) => {
        const dirPath = path.join(parentDir, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });

    files.forEach(({ dir, file, content }) => {
        const filePath = path.join(parentDir, dir, file);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, content);
        }
    });

    console.log(`Generados directorios y archivos pertinentes a "${lowerName}"`);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateInterfaceContent(name) {
    return `export default interface ${name} {}`;
}

function generateRepositoryInterfaceContent(name, singularName) {
    return `import ${capitalizeFirstLetter(name)} from './${capitalizeFirstLetter(singularName)}';
export default interface ${name}Repository {}`;
}

function generateRepositoryPostgresClassContent(name, singularName) {
    return `import ${capitalizeFirstLetter(singularName)} from '../../domain/${singularName}';
import ${singularName}Repository from '../../domain/${name}.repository';
export default class ${capitalizeFirstLetter(name)}RepositoryPostgres implements ${capitalizeFirstLetter(singularName)}Repository {}`;
}

function generateRepositoryMongoClassContent(name, singularName) {
    return `import ${capitalizeFirstLetter(singularName)} from '../../domain/${singularName}';
import ${singularName}Repository from '../../domain/${name}.repository';
export default class ${capitalizeFirstLetter(name)}RepositoryMongo implements ${capitalizeFirstLetter(singularName)}Repository {}`;
}

function generateUsecasesClassContent(lowerName, singularName) {
    return `import ${capitalizeFirstLetter(singularName)} from '../domain/${capitalizeFirstLetter(singularName)}';
import ${capitalizeFirstLetter(singularName)}Repository from '../domain/${lowerName}.repository';
export default class ${capitalizeFirstLetter(lowerName)}Usecases {
    constructor(private ${lowerName}Repository: ${capitalizeFirstLetter(singularName)}Repository) {}
}`;
}

function generateRestRouterContent(lowerName, singularName, capitalizedSingularName) {
    return `import express from "express";
import ${singularName}Repository from "../../domain/${lowerName}.repository";
import ${capitalizedSingularName}RepositoryPostgres from "../../infrastructure/db/${lowerName}.repository.postgres";
import ${capitalizedSingularName}RepositoryMongo from "../../infrastructure/db/${lowerName}.repository.mongo";
import ${capitalizedSingularName}Usecases from "../../application/${lowerName}.usecases";

const ${singularName}repositorypostgres: ${singularName}Repository = new ${capitalizedSingularName}RepositoryPostgres();
const ${singularName}usecases = new ${capitalizedSingularName}Usecases(${singularName}repositorypostgres);

const router = express.Router();
export default router;`;
}

const inputName = process.argv[2] || 'example';
createDirsAndFiles(inputName);
