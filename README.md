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

![mycardashpoc-dashboard](https://user-images.githubusercontent.com/161548/180668353-6dcb3c42-1411-4bea-8a02-d3c65482b6d0.png)

![mycardashpoc-dashboard](https://user-images.githubusercontent.com/161548/180668357-e9fbe9e9-120f-48b0-8a27-1143ba82df65.png)

![mycardashpoc-music](https://user-images.githubusercontent.com/161548/180668364-eb6e79fd-a988-445e-be96-724cb10ea84f.png)

![mycardashpoc-metrics](https://user-images.githubusercontent.com/161548/180668369-8feac193-b635-4ab4-b708-a914f21d0925.png)

## Requirements

Designed to run on a Raspberry Pi 3 with a 7" touch screen.

But can technically run on anything with Docker.

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
echo "OBD_PORT=/dev/pts/15" >> .env
```

## License

UNLICENSED
