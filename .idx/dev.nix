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
  # Search for icons at https://pictogrammers.com/library/mdi/
  previews = [{
      command = ["npm" "run" "dev"];
      manager = "web";
      id = "web";
      name = "Web";
      icon = "web";
      port = 3000;
      workingDirectory = "web";
    }];
  workspace = {
    # Runs once when the workspace is first created
    onCreate = {
      npm-install = "npm install --prefix web";
    };
  };
}
