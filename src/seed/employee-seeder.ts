import faker from 'faker';
import Employee from '../models/Employee';


export const seedEmployee = async () => {
  try { 
    const record = 5;
    const employee = [];

    for (let i = 0;i < record; i++) {
      employee.push(
        new Employee({
          employeeId: faker.datatype.number(),
          name: faker.name.findName(),
          salary: faker.finance.amount()
        })
      )
    }
    employee.forEach(employeeData => {
      Employee.create(employeeData);
    });
    console.log("success");
  } catch (err) {
    console.log(err);
  }
}


