# sdc-portal

A user-centric HTTP UI for Joyent's SmartDataCenter.

## Features

* Multi-datacenter and JPC aware.
* Get details about VMs in different SDC and JPC regions.
* Perform actions on existing VMs (e.g. start, stop, reboot).
* OAuth can be used for sign-in and mapping to SDC and JPC users.

## Development

To run sdc-portal:

    git clone git@github.com:Faithlife/sdc-portal.git
    cd sdc-portal
    cp .sdcportalrc ~/.sdcportalrc
    npm install
    grunt dev

## Configuration file

The configuration file `~/.sdcportalrc` needs to be created before sdc-portal can run. An example `.sdcportalrc` file configured for use with CoaL is in the root of this repository. OAuth configuration, data center details, and user to ssh key mappings need to be added or modified for your particular setup.

## Contributing

Bug reports and feature requests should be submitted here as issues on GitHub https://github.com/Faithlife/sdc-portal/issues. Code contributions should be made via pull requests.

Coding guidelines loosely modeled after [Joyent SDC's](https://github.com/joyent/sdc#contributing):

* JavaScript is checked with [jsstyle](https://github.com/davepacheco/jsstyle).
* Master should be first-customer-ship (FCS) quality at all times.
* `npm test` should always be successful
* Lint is checked with [javascriptlint](https://github.com/davepacheco/javascriptlint)
* Commits should have matching tests if possible
* Prefer dependencies that match the stack used with [SDC](https://github.com/joyent/sdc)
