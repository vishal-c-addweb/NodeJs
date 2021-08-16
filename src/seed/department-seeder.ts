import faker from 'faker';
import Department from '../models/Department';


export const seedDepartment = async () => {
  try { 
    const record = 10;
    const department = [];

    for (let i = 0;i < record; i++) {
      department.push(
        new Department({
          departmentName: faker.commerce.department()
        })
      )
    }
    department.forEach(departmentData => {
      Department.create(departmentData);
    });
    console.log("success");
  } catch (err) {
    console.log(err);
  }
}


