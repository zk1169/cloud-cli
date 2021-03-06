// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  name: "dev",
  version:"2.0.0",
  serverFilePath:"http://saas.dev.mei1.info/api/file/",
  localImageDefault:"assets/images/default_image.jpg",
  localAvatarDefault:"assets/images/avatar06.png"
};
