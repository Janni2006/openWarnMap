# openWarnMap

## Installation (Debian/Ubuntu)

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
