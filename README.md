Firebird - Read Me
==================

Documents inculded in Disc
===========================
	
	Python Files:

		db_driver.py
		shop_server.py

	SQL Files:

		loaditems.sql

	HTTP:

		/templates/
			index.html 

	Icon:
	
		/static/
			favicon.ico 

	Java Script:

		/static/js/
			backbone.js 
			jquery.js  
			jquery-ui.js  
			notifier.js  
			Router.js  
			underscore.js  

		/static/js/views/
			AppView.js  
			CartView.js 
			CheckoutView.js 
			InventoryView.js 
			ItemView.js  


		/static/js/models/
			CartItem.js 
			Category.js  
			Item.js  

		/static/js/collections/
			Cart.js 
			CategoryList.js
			Inventory.js

	Images:
		
		/static/img
			bg-cols.png
			item1.png
			item2.png
			item3.png
			item4.png
			item5.png
			item6.png
			item7.png
			item8.png
			item9.png
			item10.png
			item11.png
			item12.png
			item13.png
			item14.png
			item15.png
			item16.png
			item17.png
			item18.png
			item19.png
			item20.png
			item21.png
			item22.png
			item23.png
			item24.png
			item25.png
			item26.png
			item27.png
			item28.png
			item29.png
			item30.png
			item31.png
			item32.png
			item33.png
			item34.png
			item35.png
			item36.png
			item37.png
			item38.png
			item39.png
			item1000.png

		/static/css/images/
			ui-bg_flat_0_aaaaaa_40x100.png
			ui-bg_flat_75_ffffff_40x100.png
			ui-bg_glass_55_fbf9ee_1x400.png
			ui-bg_glass_65_ffffff_1x400.png
			ui-bg_glass_75_dadada_1x400.png
			ui-bg_glass_75_e6e6e6_1x400.png
			ui-bg_glass_95_fef1ec_1x400.png
			ui-bg_highlight-soft_75_cccccc_1x100.png
			ui-icons_2e83ff_256x240.png
			ui-icons_222222_256x240.png
			ui-icons_454545_256x240.png
			ui-icons_888888_256x240.png
			ui-icons_cd0a0a_256x240.png

	
	Cascading Style Sheet Document:
	
		/static/css/
			blueprint.css
			jquery-ui.css
			style.css

	

Installation
============

Install Python 2.7
	
	- http://www.python.org/getit/	

Windows:

	Download distribute_setup.py 
		
		- http://python-distribute.org/distribute_setup.py

	Add Python installation's Script Folder to the Path 	environment variable
	
		- ;C:\Python27\Scripts

	Open Command Prompt and run command:
	
		- >easy_install pip

	Follow Linux/Mac Instructions

Linux/Mac:

	Install pip

   		apt-get install python-pip

	Install flask
    
    		pip install flask

	Using database load script:

    		sqlite3 shop.db < loaddatabase.sql


Contact
=======

	Nathan Hartmann
	nhartm1@umbc.edu