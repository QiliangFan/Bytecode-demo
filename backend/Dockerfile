FROM python:3.7

ADD network /network

EXPOSE 8000

RUN pip3 install -r requirements.txt

WORKDIR /network

CMD python3 manage.py runserver 0.0.0.0:8000