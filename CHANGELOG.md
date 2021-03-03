# CHANGELOG

## Unreleased



## v2.7.0 (2021-03-03)

- Update translations and translate to German
- Handle refresh issues when with refresh token
- Fix linting errors and warnings
- Implement refresh token support
- Fix typo in usermanager API stopSilentRenew function
- Improve error as snack functionality
- Disable fatal error action button after click
- Add support for fatal errors without a final reload
- Use component based approach for notifier
- Bump oidc-client-js to 0.11.5
- Allow kapp-release/kapp-release-nightly to copy artifacts


## v2.6.0 (2021-01-14)

- Reduce AppsGrid icon size
- Fix linter errors
- Add support for custom TopBar anchor icon
- Add badge support to TopBar anchor
- Support TopBars without app logo


## v2.5.0 (2020-11-27)

- Add functionality to detect app load after update was clicked
- Ensure OIDC callbacks trigger exactly once
- Keep current browser history state on hash reset


## v2.4.0 (2020-11-13)

- Allow React 17 as peer dependency
- Add initial support for web vitals reporting
- Add service worker registration with hook support


## v2.3.0 (2020-11-12)

- Update to Material-UI 4.11
- Bump CI test environment to Node 14
- Add text to clipboard helper
- Add queueDispatch middleware
- Update browserslist
- Catch OIDC profile set error when OIDC is not initialized
- Expose internal loadUser function for OIDC UserManager
- Update more 3rd party dependencies
- Update react and react-dom version from 16.8.6 to 17.0.1
- Use warningsng plugin as checkstyle is deprecated


## v2.2.4 (2020-07-02)

- Fix linting errors and warnings
- Force OIDC mode to use fragment
- Pin styleguidist version and fix examples as needed


## v2.2.3 (2020-06-22)

- Support query strings in OIDC callbacks


## v2.2.2 (2020-02-27)

- Deduplicate dependencies and check dirty in CI


## v2.2.1 (2020-02-27)

- Add dedicated classes to topbar to allow override
- Update styleguidist
- Migrate kpop to newly introduced theme.spacing api


## v2.2.0 (2020-01-22)

- Bump version to 2.2.0
- Switch OIDC from implicit to code with pkce
- Update translations and translate to German
- Add automatic retry to config loading
- Add support for update required dialog


## v2.1.0 (2020-01-07)

- Bump version to 2.1.0
- Use glue from gluejs organization


## v2.0.0 (2019-12-20)

- Bump version to 2.0.0
- Clean up linting errors
- Support lazy user init on sign out callback
- Add support for extended history implementations
- Trigger OIDC callbacks even when initializing user lazy
- Extend authentication actions for more control
- Add support for lazy logon during intialization
- Add helper components for authenticated or unauthenticated routing
- Add AsyncComponent
- Correct error shape definition
- Properly forward ref for all functional components
- Update Material-UI to version 4
- Fixup error type definition
- Avoid flash of sign-in screen when local user data is expired
- Add message descriptor usage to error shape
- Only consider config prop in BaseContainer when its not defined
- Update oidc-client-js to 9.0.1


## v1.2.1 (2019-12-16)

- Avoid flash of sign-in screen when local user data is expired
- Add message descriptor usage to error shape
- Only consider config prop in BaseContainer when its not defined


## v1.2.0 (2019-12-13)

- Bump version to 1.2.0
- Add error options for additional behavior
- Properly store message with errors
- Update translations and translate to German
- Improve error messages
- Add snackbar notifications to common state with actions and ui
- Add more control to error messages


## v1.1.4 (2019-12-04)

- Bump version to 1.1.4
- Properly apply withGlue property when false


## v1.1.3 (2019-12-03)

- Bump version to 1.1.3
- Add support for service worker skip waiting trigger


## v1.1.2 (2019-12-03)

- Bump versiont to 1.1.2
- Improve scroll bars for Webkit and Firefox


## v1.1.1 (2019-12-03)

- Bump version to 1.1.1
- Use Glue for embedded aside apps
- Fixup CI so it runs as non-root
- Run CI with Node 12
- Change CI to run as user instead of root


## v1.1.0 (2019-11-29)

- Build dist for all branches
- Bump version to 1.1.0
- Add a toggle switch so Glue can be disabled if needed
- Bind visibility and offline manager to BaseContainer with Glue
- Add Glue support to BaseContainer
- Expose serviceworker registration to store
- Remove uppercase text transform for Buttons and increase their text size
- Use normal Button font style for MasterButton
- Reduce Masterbutton icon shadow
- Update translation files


## v1.0.1 (2019-10-17)

- Bump version to 1.0.1


## v1.0.0 (2019-10-17)


