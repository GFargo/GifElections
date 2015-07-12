this.Items = new Mongo.Collection("items");

this.Items.userCanInsert = function(userId, doc) {
	return true;
}

this.Items.userCanUpdate = function(userId, doc) {
	return true;
}

this.Items.userCanRemove = function(userId, doc) {
	return true;
}

this.Schemas = this.Schemas || {};

this.Schemas.Items = new SimpleSchema({
});


AddressSchema = new SimpleSchema({
  street: {
    type: String,
    max: 100
  },
  city: {
    type: String,
    max: 50
  },
  state: {
    type: String,
    regEx: /^A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]$/
  },
  zip: {
    type: String,
    regEx: /^[0-9]{5}$/
  }
});

CustomerSchema = new SimpleSchema({
  billingAddress: {
    type: AddressSchema
  },
  shippingAddresses: {
    type: [AddressSchema],
    minCount: 1
  }
});

this.Items.attachSchema(this.Schemas.Items);
