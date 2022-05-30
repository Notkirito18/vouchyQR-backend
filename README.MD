## Hosting
The website is hosted on : 
[VouchyQR Heroku](https://vouchyqr.herokuapp.com/home)

## About
This project is the backend side of vouchyQR, which is a MEAN stack application.

You can find the frontEnd Angular repository [here](https://github.com/Notkirito18/VouchyQR)

## Description
The goal of VouchyQR is to make voucher system easier for hotels using QR codes, by making the process of getting ones vouchers possible with one qr code scan, and so is consuming a voucher wich is possible by just showing a code to be scanned. And for this process to work, the app has three types of users, an Admin (requires log in + not all logged in users are admins), a Vender (requires log in) and a Geust (doesn't require log in). The admin creates a new guest and give the guest a QR code to scan that will take him to his page, where he can see all his vouchers as QR code cards and can also see his history of vouchers usage. To use a voucher, the guest can go to the vender and show him one of the vouchers QR codes, the vender than scans it to consume the voucher (if the voucher is expired or the vender is not logged in the consuming wont work).
