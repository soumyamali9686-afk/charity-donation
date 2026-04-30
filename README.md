Charity Donation Platform
 Description:
This is a simple charity donation website developed using HTML, CSS, and JavaScript. It provides a user-friendly interface for viewing and interacting with donation-related content.
 Features:
- Clean and responsive user interface
- Donation form (frontend-based)
- Easy navigation.
 Technologies Used:
- HTML
- CSS
- JavaScript
- MongoDB (Database Design)
 Database (MongoDB):
This project uses MongoDB (NoSQL database) to design and manage data such as users, campaigns, and donations.
 Campaigns Collection:
{
  "_id": "c201",
  "title": "Help Children Education",
  "description": "Support education for underprivileged children",
  "goalAmount": 50000,
  "raisedAmount": 20000
}
 Donations Collection:
{
  "_id": "d301",
  "userId": "u101",
  "campaignId": "c201",
  "amount": 1000,
  "date": "2026-04-30"
}
Sample MongoDB Queries:
Insert Campaign
db.campaigns.insertOne({
  title: "Help Children Education",
  description: "Support education for underprivileged children",
  goalAmount: 50000,
  raisedAmount: 0
})

Insert Donation
db.donations.insertOne({
  userId: "u101",
  campaignId: "c201",
  amount: 1000,
  date: new Date()
})

Get Campaigns
db.campaigns.find()

Update Donation Amount
db.campaigns.updateOne(
  { _id: "c201" },
  { $inc: { raisedAmount: 1000 } }
)
