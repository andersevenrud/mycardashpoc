# Deployment

This project was tested using Raspbian 64-bit desktop version.

## Configure Touch screen

Follow instructions from:

https://gist.github.com/andersevenrud/4a7e7e9517c0e621c4cbf476e21e5f30

## Install Docker

```bash
# Quickest way to get set up is using the utility script that performs apt
# commands etc.
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Give pi user docker permissions
sudo usermod -aG docker pi
```

## Optional dependencies

An on-screen keyboard is nice to have in case debugging is required.

```bash
sudo apt install matchbox-keyboard
```

## Remove unwanted dependencies

```bash
sudo apt purge geany thonny cups
sudo apt autoremove
```

## Set up project

> Pre-built docker images coming soon (tm).

You want to have a fast SD card or an overlay filesystem to a SSD for this.

```bash
# Clone source
git clone https://github.com/andersevenrud/mycardashpoc.git

# Enter source directory
cd mycardashpoc

# Ensure that everything builds
docker compose -f docker-compose.production.yml build

# Now start the project
docker compose -f docker-compose.production.yml up -d
```

It should be running on http://localhost/

## Set up Kiosk mode

**COMING SOON**
