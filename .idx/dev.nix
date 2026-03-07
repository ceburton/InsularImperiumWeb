{ pkgs, ... }:

{
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; 

  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];

  # Sets environment variables in the workspace
  env = {};

  # The 'idx' block is required to wrap these settings
  idx = {
    # Search for the extensions you want to use
    extensions = [
      # "vscode-extension-id"
    ];

    # Workspace lifecycle hooks
    workspace = {
      # Runs only the very first time the workspace is created
      onCreate = {
        # Left intentionally blank, but you could put initial setup scripts here
      };
      
      # Runs EVERY time the workspace starts or is rebuilt
      onStart = {
        npm-install = "npm install --prefix web";
      };
    };

    # Defines previews that can be started in the side panel
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "3000" "--hostname" "0.0.0.0"];
          manager = "web";
          cwd = "web";
        };
      };
    };
  };
}