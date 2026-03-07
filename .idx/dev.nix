{ pkgs, ... }:

{
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    # pkgs.go
    # pkgs.python3
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {};
  # Runs once when the workspace is first created
  onCreate = {
    npm-install = "npm install --prefix web";
  };
  # Defines a preview that can be started in the side panel
  previews = [{
      command = ["npm" "run" "dev"];
      manager = "web";
      id = "web";
      name = "Web";
      icon = "web";
      port = 3000;
      workingDirectory = "web";
  }];
}
