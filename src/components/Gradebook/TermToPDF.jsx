import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

// Estilos aprimorados
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#000',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#0080ff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    borderBottomStyle: 'solid',
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#0080ff',
    textDecoration: 'underline',
  },
  infoText: {
    fontSize: 11,
    marginBottom: 2,
  },
  topic: {
    fontSize: 11,
    marginBottom: 4,
    paddingLeft: 8,
  },
  studentBlock: {
    backgroundColor: '#f0f7ff',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  studentName: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#004c99',
  },
  studentItem: {
    fontSize: 10,
    marginBottom: 2,
    marginLeft: 8,
  },
  lessonTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0080ff',
    marginBottom: 4,
  },
});

const TermToPDF = ({ gradebook, term }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Caderneta - {gradebook.subject.name}</Text>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Informações</Text>
        <Text style={styles.infoText}>Bimestre: {term.name}</Text>
        <Text style={styles.infoText}>Professor: {gradebook.teacher.name}</Text>
        <Text style={styles.infoText}>Turma: {gradebook.classroom.grade} ({gradebook.classroom.shift})</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Aulas Ministradas</Text>
        {term.lessons.map((lesson, index) => (
          <Text key={lesson._id} style={styles.topic}>
            {index + 1}. {new Date(lesson.date).toLocaleDateString()} - {lesson.topic}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Notas e Faltas</Text>
        {term.studentEvaluations.map((evaluation, index) => (
          <View key={evaluation._id} style={styles.studentBlock}>
            <Text style={styles.studentName}>
              {index + 1}. {evaluation.student.name}
            </Text>
            <Text style={styles.studentItem}>Nota mensal: {evaluation.monthlyExam}</Text>
            <Text style={styles.studentItem}>Avaliação bimestral: {evaluation.bimonthlyExam}</Text>
            <Text style={styles.studentItem}>Qualitativo: {evaluation.qualitativeAssessment}</Text>
            <Text style={styles.studentItem}>Nota bimestral: {evaluation.bimonthlyGrade}</Text>
            <Text style={styles.studentItem}>Recuperação bimestral: {evaluation.bimonthlyRecovery}</Text>
            <Text style={styles.studentItem}>Média bimestral: {evaluation.bimonthlyAverage}</Text>
            <Text style={styles.studentItem}>Faltas: {evaluation.totalAbsences}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default TermToPDF;