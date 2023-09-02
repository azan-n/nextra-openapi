import { Command } from "commander";
import { cwd } from "node:process";
import { generateRedoc } from "./lib/cli";
import { join } from "node:path";

const program = new Command();


program
    .requiredOption('-s, --swagger <URL>', 'Path/URL to Swagger/OpenAPI spec')
    .requiredOption('-o, --outputDir <PATH>', 'Path to output directory', join(cwd(), 'generated-docs'))
    .requiredOption('--deleteExisting', 'Delete existing directory', false)

program.parse();

const options = program.opts();

generateRedoc(options['swagger'], options['outputDir'], options['deleteExisting']);