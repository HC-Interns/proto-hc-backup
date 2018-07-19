'use strict';

// -----------------------------------------------------------------
//  Exposed functions
// -----------------------------------------------------------------

function profileCreate (profileEntry) {
  var profileHash = commit("profile", profileEntry);
  return profileHash;
}

function profile_stringCreate (profile_stringEntry) {
  var profile_stringHash = commit("profile_string", profile_stringEntry);
  return profile_stringHash;
}


// -----------------------------------------------------------------
//  Backup Functions
// -----------------------------------------------------------------


function backupCommit(entryName, entry, header){
  var backupEnabled = getBackupAppsHash().length > 0;

  if (backupEnabled) {
    debug("consumerApp: Calling backup App!");
    var backup_commit = {
    sourceAppDNA:App.DNA.Hash,
    header: {
      type : entryName,
      sig : JSON.parse(header.Sig.replace(/ /g,',').replace(/['{''}']/g, '')),
      hash : makeHash(entryName,entry),
      time : header.Time,
      nextHeader : header.NextHeader,
      next : entryName+" :"+header.Next,
      entry : header.EntryLink,
    },
    content:entry,
    }
    bridge(getBackupAppsHash()[0].CalleeApp, 'backupChain', 'backup', backup_commit);
  }
}

function loadBackup() {
  var backup = bridge(getBackupAppsHash()[0].CalleeApp, 'backupChain', 'restore', {"Hash":App.DNA.Hash});
  return backup
}

function getBackupAppsHash() {
  return backupApps = getBridges().filter(function(elem) {
    return elem.CalleeName === 'backupApp'
  });
}

function backupAll() {

  debug('about to query')
  var allEntries = query({
    Return: {
      Hashes: true,
      Entries: true,
      Headers:true
    },
    Constrain: {
      EntryTypes: ["profile","profileString","%agent"]
    }
  });

  debug(allEntries)

  // return bridge(getBackupAppsHash()[0].CalleeApp, 'backupChain', 'backupBatch', allEntries);
}


// -----------------------------------------------------------------
//  The Genesis Function https://developer.holochain.org/genesis
// -----------------------------------------------------------------

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis () {
//Testing
  return true;
}

function bridgeGenesis(side, dna, appData) {
  // this is where all existing entries should be backed up!
  return true;
}

// -----------------------------------------------------------------
//  Validation functions for every change to the local chain or DHT
// -----------------------------------------------------------------

function validateCommit (entryName, entry, header, pkg, sources) {
  // debug("entry_type:"+entryName+"entry"+JSON.stringify(entry)+"header"+JSON.stringify(header)+"PKG: "+JSON.stringify(pkg)+"sources"+sources);

  if (validate(entryName, entry, header, pkg, sources)) {
    backupCommit(entryName, entry, header);
    return true;
  }
  return false;
}

function validate(entryName, entry, header, pkg, sources){
  switch (entryName) {
    case "profile":
      return true;
    case "profile_string":
      return true;
    default:
      return false;
  }
}

function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "profile":
      return false;
    case "profile_string":
      return false;
    default:
      return false;
  }
}


function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "profile":
      return false;
    case "profile_string":
      return false;
    default:
      return false;
  }
}

function validateDel (entryName, hash, pkg, sources) {
  switch (entryName) {
    case "profile":
      return false;
    case "profile_string":
      return false;
    default:
      return false;
  }
}

function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "profile":
      return false;
    case "profile_string":
      return false;
    default:
      return false;
  }
}

function validatePutPkg (entryName) {
  return null;
}

function validateModPkg (entryName) {
  return null;
}

function validateDelPkg (entryName) {
  return null;
}

function validateLinkPkg (entryName) {
  return null;
}
