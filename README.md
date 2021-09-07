<img src="images/logo.svg?raw=true" height="96" alt="openWarnMap"/>

---

## Usage

This project was initiated to protect its users from oak processionary moths and ticks.

<img src="images/window.png?raw=true"  alt="openWarnMap"/>

## Why is this so usefull?

- **Centralised visualisation** You no longer have to scan through multiple forms. Just use this platform and see everything in one view.
- **Free** Every function is free for private use. We earn the money to run this page with you donating your money

## Development setup (Debian/Ubuntu)

1. ### Requirements

   - Make sure python is installed and fully set up on your system
   - Install geospatial libraries -> run `sudo apt-get install binutils libproj-dev gdal-bin`

2. [Download](https://github.com/Janni2006/openWarnMap/archive/refs/heads/main.zip) or clone (run `git clone https://github.com/Janni2006/openWarnMap.git`)
3. open shell and navigate inside folder `openWarnMap`
   - Create virtual enviroment with `python3 -m venv venv`
   - Activate virtual enviroment `source venv/bin/activate`
   - install the required libaries `pip install -r requirements.txt`
   - make migrations `python manage.py makemigrations`
   - apply migrations `python manage.py migrate`
   - start your server `python manage.py runserver`
   - enjoy your very own installation of the openWarnMap!
