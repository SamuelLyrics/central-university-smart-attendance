
import { Student } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

const getStudents = (): Student[] => {
  const studentsJson = localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENTS);
  return studentsJson ? JSON.parse(studentsJson) : [];
};

const saveStudents = (students: Student[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const addStudent = async (studentData: Omit<Student, 'id' | 'registrationDate'>): Promise<Student> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const students = getStudents();
      if (students.some(s => s.indexNumber === studentData.indexNumber)) {
        reject(new Error('Student with this index number already exists.'));
        return;
      }
      const newStudent: Student = {
        ...studentData,
        id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        registrationDate: new Date().toISOString(),
      };
      students.push(newStudent);
      saveStudents(students);
      resolve(newStudent);
    }, 300);
  });
};

export const getAllStudents = async (): Promise<Student[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getStudents());
        }, 200);
    });
};

export const getStudentByIndexNumber = async (indexNumber: string): Promise<Student | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getStudents();
            resolve(students.find(s => s.indexNumber === indexNumber));
        }, 100);
    });
};

export const getStudentById = async (studentId: string): Promise<Student | undefined> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const students = getStudents();
            resolve(students.find(s => s.id === studentId));
        }, 100);
    });
};

export const updateStudent = async (studentId: string, updatedData: Partial<Omit<Student, 'id'>>): Promise<Student | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let students = getStudents();
            const studentIndex = students.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                students[studentIndex] = { ...students[studentIndex], ...updatedData };
                saveStudents(students);
                resolve(students[studentIndex]);
            } else {
                resolve(null);
            }
        }, 300);
    });
};

export const deleteStudent = async (studentId: string): Promise<boolean> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            let students = getStudents();
            const initialLength = students.length;
            students = students.filter(s => s.id !== studentId);
            if (students.length < initialLength) {
                saveStudents(students);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 300);
    });
};
