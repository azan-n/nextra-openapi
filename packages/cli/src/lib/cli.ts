import { mkdirSync } from 'fs'
import { join } from 'node:path';
import * as slug from 'slug'
import { outputFile } from 'fs-extra'
import { AppStore, GroupModel, IMenuItem, OperationModel, isAbsoluteUrl, loadAndBundleSpec } from 'redoc';
import { resolve } from 'path';
import { getIntroductionMdx, getSectionMdx } from './mdx-generators';

export async function generateRedoc(path: string, outputDir: string) {
  const api = await loadAndBundleSpec(isAbsoluteUrl(path) ? path : resolve(path));

  // Create Redoc store. This contains info about the spec and the menu items.
  const appStore = new AppStore(api);

  const _meta: MetaJson = {};

  if (appStore.spec.info) {
    // Write the index.mdx file
    writeFileGuarded(join(outputDir, 'index.mdx'), getIntroductionMdx(appStore.spec.info));
    // Add entry to top level _meta.json
    _meta['index'] = 'Introduction';
  } else {
    throw new Error('No spec.info defined. Please check your OpenAPI spec.');
  }

  createFilesForItems(appStore.menu.items, outputDir, _meta);

  // Write top level _meta.json
  writeFileGuarded(join(outputDir, '_meta.json'), JSON.stringify(_meta, null, 2));
}


function createFilesForItems(menuItems: IMenuItem[], outputDir: string, parentMetaJson: MetaJson) {
  for (const item of menuItems) {
    if (item.type === 'operation') {
      // Coerce type as per Redoc internals
      const operation = item as OperationModel;
      // Safe file name
      const fileName = slug(operation.name.concat('.operation'));
      // Create file for the operation
      writeFileGuarded(join(outputDir, fileName.concat('.mdx')), operation.httpVerb);
      // Create an entry in the meta.json for the operation
      parentMetaJson[fileName] = (item.sidebarLabel);
    } else if (item.type === 'section') {
      // Coerce type as per Redoc internals
      const section = item as GroupModel;
      // Safe file name to prevent tag and section name collisions
      const sectionFileName = slug(section.name.concat('.section'));
      // Create a page for the section
      writeFileGuarded(join(outputDir, sectionFileName.concat('.mdx')), getSectionMdx(section));
      // Create an entry in the meta.json for the section
      parentMetaJson[sectionFileName] = (item.name);
    } else if (item.type === 'tag') {
      // Coerce type as per Redoc internals
      const tag = item as GroupModel;

      // Safe dir name
      const tagDirName = slug(tag.name);

      // Create a folder for the children of the tag
      const tagFolder = join(outputDir, tagDirName);
      mkdirSync(tagFolder, { recursive: true });

      // Create tag page within tag folder
      // TODO flag for not creating tag page
      writeFileGuarded(join(outputDir, tagDirName.concat('.mdx')), getSectionMdx(tag));
      // Create an entry in the meta.json for the tag
      parentMetaJson[tagDirName] = "";

      // Store for tag level _meta.json
      const _tag_meta: MetaJson = {};

      // Write files for children in the tag folder
      createFilesForItems(tag.items, tagFolder, _tag_meta);

      // Write tag level _meta.json
      writeFileGuarded(join(tagFolder, '_meta.json'), JSON.stringify(_tag_meta, null, 2));
    } else if (item.type === 'group') {
      // Add a separator to the _meta.json for the Group
      parentMetaJson[`-- ${item.name}`] = { title: item.name, type: 'separator' };
      // Handle children of the group
      createFilesForItems(item.items, outputDir, parentMetaJson);
    } else {
      throw new Error(`Unknown menu item type: ${item.type}`);
    }
  }
}

/** TODO add link to GH issues if there is an error */
function writeFileGuarded(path: string, data: string) {
  try {
    outputFile(path, data, { encoding: 'utf8' })
  } catch (err) {
    console.error(`Error writing file: ${path}, please check your permissions.`);
    throw new Error(`${err}`);
  }
}

type _MetaJsonDisplayTypes = 'separator' | 'page'
type MetaJson = Record<string, string | { title: string, type: _MetaJsonDisplayTypes }>
