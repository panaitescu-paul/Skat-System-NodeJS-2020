# test
from person import Person
import pandas as pd
import csv

def validate_input(inp):
    while inp.lower() != 'y' and inp.lower() != 'n':
        inp = input('Try again [Y/n]: \n>>> ')
    
    if inp.lower() == 'y':
        return True
    else:
        return False


peopleToAdd= []

def add_people(f_name, l_name, email, phone, date_of_birth, address, country):
    print('Processing your request...')
    p = Person(f_name, l_name, date_of_birth, email, country, phone, address)
    p.validate_date_of_birth()
    p.is_valid()
    peopleToAdd.append(p)



print("Welcome to this registration client CLI!")

inp = input("Would you like to add a person? [Y/n]")

while True:
    flag = validate_input(inp)
    if flag:
        f_name = input("First name: ")
        l_name = input("Last name: ")
        email = input("Email: ")
        date_of_birth = input("Date of birth in format [DD-MM-YYYY]: ")
        country = input("Country: ")
        address = input("Address: ")
        phone = input("Phone: ")
        add_people(f_name, l_name, email, phone, date_of_birth, address, country)
        inp = input("Add another one? ")
    else:
        with open("../Main_System/people.csv", "w", newline='') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['FirstName', 'LastName', 'Email', 'DateOfBirth', 'Phone', 'Address', 'Country'])
            for p in peopleToAdd:
                writer.writerow([p.FirstName, p.LastName, p.Email, p.DateOfBirth, p.Phone, p.Address, p.Country])
        break



