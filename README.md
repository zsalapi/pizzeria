Pizzeria website, which is a trial task for PostiveAdamsky, was completed in one day. I am publishing it as free software. Please use it freely.
Add also a small gitlab-ci.yml which contains tests, I used It in my local Gitlab.

Since categories can be changed dynamically from the admin interface,
therefore I put the choice for customers in a drop-down menu on the main page, so there will be no problem, for example, with 8 categories.

By clicking on the cart, the cart layer will be displayed, by clicking on it again, we will return to the products.

On the admin interface, by clicking on the ID, you can find out what the person ordered and how much it cost.

I uploaded Open Sans from the npm package.

When updating products, it is worth checking the file upload section
because the browser remembers what we uploaded previously, it is worth deleting this from the form or figuring out what we want to upload!


You can install the database with the file from sql directory, the passwords of the two admin user:
admin / titok1234   |
admin2 / titok1234

----------------------------------------------------------------------------------------------------------------------------

The task: Creating a food ordering website

Create a fully functional pizza ordering website with an admin interface where you can upload new pizzas with images, categories, and admin users. It should be possible to edit and delete this data.

You can download the files (design, images) for the task at this link: https://positive.hu/jelentkezo/adatok.zip

 

Requirements:

·                    Use ajax/fetch everywhere, everything should be written in native code, using what is allowed: jquery, bootstrap

If you don't have any unique ideas for the layout, you can use the one at the link above
·                    Use the following font: Open Sans (do not load from Google Fonts)

·                    The page reads the available pizzas from the database and stores the order in the database. The data to be recorded is as follows:

o        Food:

·                    Food name

·                    Price

·                    Image

o        Categories

·                    Categorization and display of dishes; clicking on a category displays only the dishes in that category.

o        To order:

·                    Name

·                    Phone number

·                    Address

·                    Pizzas ordered, their quantities, and prices

·                    Order time

o        When the order is submitted, the site should provide feedback to the customer about the items ordered and the amount to be paid

·                    The form fields should be validated

·                     Admin interface login, where the following can be done:

o         Upload, edit, and delete pizzas; it should be possible to upload images (not links, but actual file uploads), and images should be cropped to a uniform size upon upload

o        Upload, edit, and delete categories

o        List orders, with the most recent always at the top

o        Upload, edit, and delete admin users
