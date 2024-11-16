// rolePermissions.js
const rolePermissions = {
    Superadmin: ['all'],
    Admin: ['manageUsers', 'viewReports'],
    Teacher_Lab_Assistant: ['viewDocuments', 'submitReports'],
    HOD: ['approveReports', 'manageDepartments'],
    'Office Superintendent': ['manageFinance', 'viewDocuments'],
    Registrar: ['manageAdmissions', 'viewStudentRecords'],
    Principal: ['approveBudgets', 'viewAllReports'],
  };
  
  module.exports = rolePermissions;
  