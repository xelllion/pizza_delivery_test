# PizzaGo — Midterm Project

## Project topic
PizzaGo is a responsive multi-page pizza delivery website. The idea was first planned in WEB Assignment 1, Task 5, and developed here into a complete midterm website.

The target audience is students and young professionals who want a simple way to browse pizzas, add items to a cart, enter delivery details and track an order.

## Pages
1. **Home (`index.html`)** — hero section, popular pizzas, CTA buttons and service benefits.
2. **Menu (`menu.html`)** — pizza catalog with category filters and add-to-cart buttons.
3. **Cart & Checkout (`cart.html`)** — cart table, quantity controls, order summary and delivery form.
4. **Track Order (`tracking.html`)** — order-number search and four-step delivery timeline. Demo order: `PG1024`.
5. **Contact (`contact.html`)** — contact details, feedback form and short About section.

## Features implemented
- Semantic HTML5: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.
- Bootstrap 5 grid, navbar, utilities, forms, toast and responsive classes.
- Custom CSS using selectors, classes, spacing, colors, typography and alignment.
- Flexbox for navigation, hero actions, footer and cart controls.
- CSS Grid for pizza cards, benefits, contact information and order overview.
- Positioning: relative/absolute cart badge and pizza labels; sticky order summary/header.
- Two responsive breakpoints: tablet (`991.98px`) and mobile (`575.98px`).
- Required table on the Cart page.
- Required forms on Cart/Checkout and Contact pages.
- JavaScript localStorage cart that works across pages.
- Quantity update/remove actions and calculated subtotal/delivery/total.
- Demo checkout creates an order number and redirects to tracking.
- Menu filters and order tracking demo.

## Design
The project continues the visual language of the previous WEB assignments: Georgia headings, Arial body text, warm background, white cards, rounded corners, soft shadows, hover movement and simple navigation. The palette was adapted to a pizza-delivery theme with dark brown, cream and orange accents.

## Technologies
- HTML5
- CSS3
- Bootstrap 5.1.1 (local files in the `vendor` folder)
- JavaScript (vanilla JS / localStorage)

## Run locally
Open `index.html` in a browser. Bootstrap, custom CSS, JavaScript and illustration images are stored locally, so the project also works without an internet connection.

## Deployment
Publish the project with GitHub Pages or Netlify and submit the public link together with the project folder.
