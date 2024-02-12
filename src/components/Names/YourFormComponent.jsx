import React from 'react';

const YourFormComponent = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    // Access the values as an array
    const formData = new FormData(event.target);
    const values = formData.getAll('yourInputFieldName[]');
    // const values = [...formData];
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Multiple input fields with the same name forming an array */}
      <input type="text" name="yourInputFieldName[]" />
      <input type="text" name="yourInputFieldName[]" />
      <input type="text" name="yourInputFieldName[]" />

      <button type="submit">Submit</button>
    </form>
  );
};

export default YourFormComponent;
