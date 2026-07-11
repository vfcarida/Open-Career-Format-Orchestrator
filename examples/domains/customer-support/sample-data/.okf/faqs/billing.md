---
id: "faq-billing-01"
title: "Billing FAQ: Pro-rating and Upgrades"
type: "faq"
tags: ["billing", "upgrade", "faq"]
---

# Pro-rating and Upgrades

When a customer upgrades from the Basic tier to the Premium tier mid-cycle, the system automatically pro-rates the charge.

## Standard Procedure

1. Verify the customer's current billing cycle end date.
2. Calculate the difference in tier pricing.
3. The customer will be charged immediately for the remaining days of the Premium tier in the current cycle.
4. Next month's invoice will reflect the full Premium tier price.

## Troubleshooting

If the customer complains that they were overcharged, check the `invoice_history` in Stripe. Sometimes the system creates a separate invoice instead of adding to the next cycle. If this happens, issue a credit for the overlapping days.
