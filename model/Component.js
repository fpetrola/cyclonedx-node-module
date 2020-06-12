/*
 * This file is part of CycloneDX Node Module.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * Copyright (c) Steve Springett. All Rights Reserved.
 */
const parsePackageJsonName = require('parse-packagejson-name');
const PackageURL = require('packageurl-js');
const LicenseChoice = require('./LicenseChoice');
const HashList = require('./HashList');
const ExternalReferenceList = require('./ExternalReferenceList');

class Component {

  constructor(pkg, includeLicenseText = true) {
    if (pkg) {
      this._type = this.determinePackageType(pkg);
      this._bomRef = this._purl;

      let pkgIdentifier = parsePackageJsonName(pkg.name);
      this._group = pkgIdentifier.scope;
      if (this._group != null) this._group = '@' + this._group;
      this._name = pkgIdentifier.fullName;
      this._version = pkg.version;
      this._description = pkg.description;
      this._licenses = new LicenseChoice(pkg, includeLicenseText);
      this._hashes = new HashList(pkg);
      this._externalReferences = new ExternalReferenceList(pkg);

      this._purl = new PackageURL('npm', this._group, this._name, this._version, null, null).toString();
    }
  }

  /**
   * If the author has described the module as a 'framework', the take their
   * word for it, otherwise, identify the module as a 'library'.
   */
  determinePackageType(pkg) {
    if (pkg.hasOwnProperty('keywords')) {
      for (let keyword of pkg.keywords) {
        if (keyword.toLowerCase() === 'framework') {
          return 'framework';
        }
      }
    }
    return 'library';
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  get purl() {
    return this._purl;
  }

  set purl(value) {
    this._purl = value;
  }

  get bomRef() {
    return this._bomRef;
  }

  set bomRef(value) {
    this._bomRef = value;
  }

  get group() {
    return this._group;
  }

  set group(value) {
    this._group = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get version() {
    return this._version;
  }

  set version(value) {
    this._version = value;
  }

  get licenses() {
    return this._licenses;
  }

  set licenses(value) {
    this._licenses = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get hashes() {
    return this._hashes;
  }

  set hashes(value) {
    this._hashes = value;
  }

  get externalReferences() {
    return this._externalReferences;
  }

  set externalReferences(value) {
    this._externalReferences = value;
  }

  toJSON() {

  }

  toXML() {
    return {
      '@type'            : this._type,
      '@bom-ref'         : this._bomRef,
      group              : this._group,
      name               : this._name,
      version            : this._version,
      description        : { '#cdata' : this._description },
      hashes             : (this._hashes) ? this._hashes.toXML() : null,
      licenses           : (this._licenses) ? this._licenses.toXML(): null,
      purl               : this._purl,
      externalReferences : (this._externalReferences) ? this._externalReferences.toXML() : null,
    };
  }
}

module.exports = Component;
