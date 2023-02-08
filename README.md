## The problem:
Task: Voucher Pool
The objective is to create a voucher pool microservice based in NodeJs. You can use whichever libraries you prefer. The service should expose a ​REST API​.

A voucher pool is a collection of voucher codes that can be used by customers to get discounts on website. Each code may only be used once, and we would like to know when it was used by the customer. Since there can be many customers in a voucher pool, we need a call that auto-generates voucher codes for each customer.

##Disclaimer
- The Authentication part is present to used as easy way to test the task, and it shouldn't be present in a voucher microservice.
- The User model is has more info than it should in a real microservice, but it is used only for the task testing facilitation.
- The Authentication module is all written in direct module functions for simplicity since it is not in the core of the task.
- I didn't make intensive testing on the authentication module since it is not in the core of the task.
