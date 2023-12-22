#!/usr/bin/env bash

set -Eeuo pipefail

GITMODULES=".gitmodules"
FEXT=".bak"
GITMODULES_BACKUP="${GITMODULES}${FEXT}"

function cleanup {
  echo "Cleaning the runner..."
  rm -f "$GITMODULES" "$GITMODULES_BACKUP"
  git restore "$GITMODULES"
  echo "Done!"
}

trap cleanup EXIT

function submodule_workaround {
  if [ "$GITHUB_REPO_CLONE_TOKEN" == "" ]; then
    echo "GITHUB_REPO_CLONE_TOKEN is empty!"
    exit 1
  fi

  echo "Monkey patching..."
  sed -i"$FEXT" "s/git@github.com:/https:\/\/oauth2:${GITHUB_REPO_CLONE_TOKEN}@github.com\//" "$GITMODULES"
  echo "Done!"

  echo "Synchronising submodules' remote URL configuration..."
  git submodule sync
  echo "Done!"

  echo "Updating the registered submodules to match what the superproject expects..."
  git submodule update --init --recursive --jobs "$(getconf _NPROCESSORS_ONLN)"
  echo "Done!"
}

submodule_workaround