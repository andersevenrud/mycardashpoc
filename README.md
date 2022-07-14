# mycardashpoc

Personal RasPi console for my car for basic diagnostics and media playback.

Integrates with OBD and MPD and serves a simple dashboard with pluggable modules.

![screenshot](https://user-images.githubusercontent.com/161548/173695326-5e952c53-6d44-4795-9618-be2de56aadc1.png)

## Requirements

Raspberry Pi 3 or newer. Some libraries currently does not compile correctly on 32-bit ARM.

Designed to run in some sort of kiosk mode.

## Development

To start a development enviroment, run `docker-compose up`.

Runs on `http://localhost:3000`.

Uses ESLint and Prettier to maintain code style and Conventional Commits.

## Deployment

For a production environment, run `docker-compose -f docker-compose.production.yml up`.

Runs on `http://localhost`.

## TODO

This sofware is in no way complete

* Playlist editing
* Show OBD from prometheus

## Manual

### User Interface

Navigation is done via the Home screen or dragging left/right to change current module.

Dragging up/down will take you back to the Home screen (can also be done via clicking header title).

This is contextual, so certain modules that uses overlays/modals can react to these gestures as well.

### Music Library

Copy your music library to `data/mpd/music` and it will get indexed automatically.

### OBD Connection

Requires a (USB) serial connection to a standard OBD-II interface.

## License

UNLICENSED
