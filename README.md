# mycardashpoc

Personal RasPi console for my car for basic diagnostics and media playback.

Integrates with OBD and MPD and serves a simple dashboard with pluggable modules.

* General
  * Touch optimized interface
  * Built for small screens
  * Virtual keyboard
  * Gestures
  * Data logging
* Dashboard
  * Instrument cluster
  * General information
* Music player
  * Basic controls
  * Music browser and playlist
  * Album art and theme support
* Diagnostics
  * DTC Reading and Clearing
  * Metrics inspection

![screenshot](https://user-images.githubusercontent.com/161548/173695326-5e952c53-6d44-4795-9618-be2de56aadc1.png)

## Requirements

Raspberry Pi 3 or newer. Some libraries currently does not compile correctly on 32-bit ARM.

Designed to run in some sort of kiosk mode.

## Development

To start a development enviroment, run `docker compose up`.

Runs on `http://localhost:3000`.

Uses ESLint and Prettier to maintain code style and Conventional Commits.

## Deployment

For a production environment, run `docker compose -f docker-compose.production.yml up`.

Runs on `http://localhost`.

## TODO

This sofware is in no way complete

* Playlist editing
* More OBD integration

## Manual

### User Interface

Navigation is done via the Home screen or dragging left/right to change current module.

Dragging up/down will take you back to the Home screen (can also be done via clicking header title).

This is contextual, so certain modules that uses overlays/modals can react to these gestures as well.

### Music Library

Copy your music library to `data/mpd/music` and it will get indexed automatically.

### OBD Connection

Requires a ELM327 (USB) serial connection to a standard OBD-II interface.

You can install a [ELM327 Emulator](https://github.com/Ircama/ELM327-emulator) for debugging purposes:

```bash
python3 -m pip install ELM327-emulator
python3 -m elm -s car
```

Make a note of the port given, then put it in your dotenv file:

```bash
echo "OBD_PORT=/dev/pts/15 >> .env"
```

## License

UNLICENSED
