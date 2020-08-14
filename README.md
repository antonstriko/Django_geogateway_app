# geogateway-django-app

## Setting up the development environment

This assumes you have the airavata-django-portal repo cloned and the development environment setup. 
Instructions are provided here: https://github.com/apache/airavata-django-portal

1. Clone this repo

2. Install dependencies and build frontend code
   * ``` cd geogateway-django-app/frontend ```
   * ``` yarn install ```

4. Install django app in develop mode
* **With airavata-django-portal virtual environment activated in separate terminal:**
   * ``` cd geogateway-django-app ```
   * ``` python setup.py develop ```
   * **Run Airavata Django Portal Server**
5. In previous terminal run: ``` yarn serve ``` 
6. Point your browser to http://localhost:8000
