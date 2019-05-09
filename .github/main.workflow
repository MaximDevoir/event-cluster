# https://developer.github.com/actions/managing-workflows/workflow-configuration-options/

################################################
# Workflow for a branch push
################################################
workflow "build and test, conditional publish" {
  resolves = [
    "branch.lint.node.10",
    "branch.test.node.10",
    "branch.coveralls.node.10",
    "release.npm.publish",
    "snyk.audit"
  ]
  on = "push"
}

# Branch filter
action "branch.filter" {
  uses = "actions/bin/filter@master"
  args = ["branch"]
}

# node 10
action "branch.install.node.10" {
  uses = "docker://node:10"
  args = "yarn install"
}

action "branch.build.node.10" {
  uses = "docker://node:10"
  needs = ["branch.install.node.10"]
  args = "yarn run build"
}

action "branch.lint.node.10" {
  uses = "docker://node:10"
  needs = ["branch.install.node.10"]
  args = "yarn run lint"
}

action "branch.test.node.10" {
  uses = "docker://node:10"
  needs = ["branch.build.node.10"]
  args = "yarn run test"
}

action "branch.coveralls.node.10" {
  needs = "branch.install.node.10"
  uses = "actions/npm@master"
  args = "run coveralls"
  secrets = ["COVERALLS_REPO_TOKEN"]
  env = {
    COVERALLS_SERVICE_NAME = "Github Actions"
  }
}

action "snyk.audit" {
  needs = "branch.install.node.10"
  uses = "clarkio/snyk-cli-action@master"
  args = ["test"]
  secrets = ["SNYK_TOKEN"]
}

action "release.filter" {
  needs = ["branch.test.node.10"]
  uses = "actions/bin/filter@master"
  args = "tag v*"
}

action "release.auth" {
  needs = ["release.filter"]
  uses = "actions/bin/filter@master"
  args = ["actor", "MaximDevoir"]
}

action "release.npm.publish" {
  needs = ["release.auth"]
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = [
    "NPM_AUTH_TOKEN",
  ]
}

################################################
# Workflow for a Pull request
################################################
workflow "build and test on PR" {
  resolves = [
    "pr.lint.node.10",
    "pr.test.node.10",
    "pr.snyk.audit",
    "pr.coveralls.node.10",
    "pr.npm.dry-publish"

  ]
  on = "pull_request"
}

# node 10
action "pr.filter" {
  uses = "actions/bin/filter@master"
  args = "action 'opened|synchronize|reopened'"
}

action "pr.npm.dry-publish" {
  needs = ["pr.filter"]
  uses = "actions/npm@master"
  args = "publish --dry-run"
}

action "pr.install.node.10" {
  needs = ["pr.filter"]
  uses = "docker://node:10"
  args = "yarn install"
}

action "pr.build.node.10" {
  uses = "docker://node:10"
  needs = ["pr.install.node.10"]
  args = "yarn run build"
}

action "pr.lint.node.10" {
  uses = "docker://node:10"
  needs = ["pr.install.node.10"]
  args = "yarn run lint"
}

action "pr.test.node.10" {
  uses = "docker://node:10"
  needs = ["pr.build.node.10"]
  args = "yarn run test"
}

action "pr.coveralls.node.10" {
  needs = "pr.install.node.10"
  uses = "actions/npm@master"
  args = "run coveralls"
  secrets = ["COVERALLS_REPO_TOKEN"]
  env = {
    COVERALLS_SERVICE_NAME = "Github Actions"
  }
}

action "pr.snyk.audit" {
  needs = "pr.install.node.10"
  uses = "clarkio/snyk-cli-action@master"
  args = ["test"]
  secrets = ["SNYK_TOKEN"]
}
