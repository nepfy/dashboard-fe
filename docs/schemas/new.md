Template: New

Section: Introduction
Whole section can be hidden? No (default is false)

Field: Company Name
Type: String
Section: Introduction
Can be hidden? Yes

Field: Company Logo
Type: String
Section: Introduction
Can be hidden? Yes

Field: Button Title
Section: Introduction
Can be hidden? No

Field: Client Name
Type: String
Section: Introduction
Can be hidden? No

Field: Client Photo
Type: String
Section: Introduction
Can be hidden? Yes

Field: Title
Type: String
Section: Introduction
Can be hidden? No

Field: Validity
Type: Date
Section: Introduction
Can be hidden? No

Subsection: Photos
Type: Array
SubField: Photo
Type: String
Section: Introduction
Can be hidden? Yes, each record can be hidden individually

---

Section: About Us
Whole section can be hidden? Yes (default is false)

Field: Validity
Type: Date
Section: About Us
Can be hidden? No

Field: Title
Type: String
Section: About Us
Can be hidden? No

Field: Subtitle
Type: String
Section: About Us
Can be hidden? Yes

Subsection: Team
Type: Array
SubField: Photo
Type: String
SubField: Description
Type: String
Section: About Us
Can be hidden? Yes, each record can be hidden individually

Subsection: Marquee
Type: Array
SubField: Service Name
Type: String
Section: About Us
Can be hidden? Yes, each record can be hidden individually

Field: Main Description
Type: String
Section: About Us
Can be hidden? Yes

Field: Additional Description 1
Type: String
Section: About Us
Can be hidden? Yes

Field: Additional Description 2
Type: String
Section: About Us
Can be hidden? Yes

---

Section: Clients
Whole section can be hidden? Yes (default is false)

Subsection: Clients
Type: Array
SubField: Logo
Type: String
SubField: Name
Type: String
Can be hidden? Yes, each record can be hidden individually

---

Section: Expertise
Whole section can be hidden? Yes (default is false)

Field: Tagline
Section: Expertise
Can be hidden? Yes

Field: Title
Section: Expertise
Can be hidden? Yes

Subsection: Topics
Type: Array
SubField: Title
Type: String
SubField: Description
Type: String
Section: Expertise
Can be hidden? Yes, each record can be hidden individually

---

Section: Plans
Whole section can be hidden? Yes (default is false)

Field: Title
Section: Plans
Can be hidden? Yes

Field: Subtitle
Section: Plans
Can be hidden? No

Subsection: Plans
Type: Array
SubField: Title
Type: String
SubField: Description
Type: String
SubField: Price
Type: String
SubField: Plan Period
Type: String [monthly, yearly, one-time]
SubField: Button Title
Type: String
Subsection inside Plans: Included Items
Type: Array
SubField: Description
Type: String
Section: Plans
Can be hidden? Yes, each record can be hidden individually

---

Section: Terms and Conditions
Whole section can be hidden? Yes (default is false)

Field: Title
Type: String
Section: Terms and Conditions
Can be hidden? No

Subsection: Terms and Conditions
Type: Array
SubField: Title
Type: String
SubField: Description
Type: String
Section: Terms and Conditions
Can be hidden? Yes, each record can be hidden individually

---

Section: FAQ
Whole section can be hidden? Yes (default is false)

Subsection: FAQ
Type: Array
SubField: Question
Type: String
SubField: Answer
Type: String
Section: FAQ
Can be hidden? Yes, each record can be hidden individually

---

Section: Footer
Whole section can be hidden? No (default is false)

Field: Call to Action
Section: Footer
Can be hidden? No

Field: Validity
Section: Footer
Can be hidden? No

Field: Email
Section: Footer
Can be hidden? No

Field: Whatsapp
Section: Footer
Can be hidden? No

Subsection: Marquee (Comes from About Us)
Type: Array
SubField: Service Name
Type: String
Section: Footer
Can be hidden? Yes, each record can be hidden individually

---

Aditional Information:

Proposal Name
Type: String

Proposal Id
Type: String

Proposal Date
Type: Date

Proposal Status
Type: String ("active", "approved", "negotiation", "rejected", "draft", "expired", "archived")

Proposal Sent Date
Type: Date

Proposal Visualization Date
Type: Date
