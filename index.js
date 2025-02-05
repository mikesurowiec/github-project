// @ts-check

import { Octokit } from "@octokit/core";

import { listItems } from "./api/items.list.js";
import { addItem } from "./api/items.add.js";
import { getItem } from "./api/items.get.js";
import { getItemByContentId } from "./api/items.get-by-content-id.js";
import { getItemByContentRepositoryAndNumber } from "./api/items.get-by-content-repository-and-number.js";
import { updateItem } from "./api/items.update.js";
import { updateItemByContentId } from "./api/items.update-by-content-id.js";
import { updateItemByContentRepositoryAndNumber } from "./api/items.update-by-content-repository-and-number.js";
import { removeItem } from "./api/items.remove.js";
import { removeItemByContentId } from "./api/items.remove-by-content-id.js";
import { removeItemByContentRepositoryAndNumber } from "./api/items.remove-by-content-repository-and-name.js";

/** @type {import("./").BUILT_IN_FIELDS} */
export const BUILT_IN_FIELDS = {
  title: "Title",
  status: "Status",
};

export default class GitHubProject {
  /**
   * @param {import(".").GitHubProjectOptions} options
   */
  constructor(options) {
    const { org, number, fields = {} } = options;

    // set octokit either from `options.octokit` or `options.token`
    const octokit =
      "token" in options
        ? new Octokit({ auth: options.token })
        : options.octokit;

    /** @type {import(".").GitHubProjectState} */
    const state = {
      didLoadFields: false,
      didLoadItems: false,
    };

    // set API
    const itemsApi = {
      list: listItems.bind(null, this, state),
      add: addItem.bind(null, this, state),
      get: getItem.bind(null, this, state),
      getByContentId: getItemByContentId.bind(null, this, state),
      getByContentRepositoryAndNumber: getItemByContentRepositoryAndNumber.bind(
        null,
        this,
        state
      ),
      update: updateItem.bind(null, this, state),
      updateByContentId: updateItemByContentId.bind(null, this, state),
      updateByContentRepositoryAndNumber:
        updateItemByContentRepositoryAndNumber.bind(null, this, state),
      remove: removeItem.bind(null, this, state),
      removeByContentId: removeItemByContentId.bind(null, this, state),
      removeByContentRepositoryAndNumber:
        removeItemByContentRepositoryAndNumber.bind(null, this, state),
    };
    Object.defineProperties(this, {
      org: { get: () => org },
      number: { get: () => number },
      fields: { get: () => ({ ...fields, ...BUILT_IN_FIELDS }) },
      octokit: { get: () => octokit },
      items: { get: () => itemsApi },
    });
  }
}
