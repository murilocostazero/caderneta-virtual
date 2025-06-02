import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  header: { fontSize: 16, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  section: { marginBottom: 10 },
  table: { display: "table", width: "100%", borderStyle: "solid", borderWidth: 1, borderColor: "black" },
  row: { flexDirection: "row" },
  cell: { flex: 1, padding: 5, borderStyle: "solid", borderWidth: 1, borderColor: "black", textAlign: "center" },
  bold: { fontWeight: 700 }
});

const GradebookPDF = ({ gradebook }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cabeçalho */}
      <View style={styles.section}>
        <Text style={styles.header}>Caderneta Escolar</Text>
        <Text>
          <Text style={styles.bold}>
            Professor: </Text>
          {gradebook.teacher.name}
        </Text>
        <Text>
          <Text style={styles.bold}>
            Disciplina:
          </Text> {gradebook.subject.name}</Text>
        <Text>
          <Text style={styles.bold}>
            Turma: </Text>
          {gradebook.classroom.grade}º {gradebook.classroom.name} ({gradebook.classroom.shift})</Text>
        <Text>
          <Text style={styles.bold}>
            Ano Letivo: </Text> {gradebook.academicYear}</Text>
      </View>

      {/* Loop pelos bimestres */}
      {gradebook.terms.map((term) => (
        <View key={term.name} style={styles.section}>
          <Text style={styles.bold}>{term.name}</Text>

          {/* Tabela de Notas */}
          <View style={styles.table}>
            <View style={[styles.row, styles.bold]}>
              <Text style={styles.cell}>Aluno</Text>
              <Text style={styles.cell}>Mensal</Text>
              <Text style={styles.cell}>Bimestral</Text>
              <Text style={styles.cell}>Qualitativa</Text>
              <Text style={styles.cell}>Nota Final</Text>
              <Text style={styles.cell}>Recuperação</Text>
              <Text style={styles.cell}>Média</Text>
              <Text style={styles.cell}>Faltas</Text>
            </View>
            {term.studentEvaluations.map((evaluation, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{evaluation.student.name}</Text>
                <Text style={styles.cell}>{evaluation.monthlyExam}</Text>
                <Text style={styles.cell}>{evaluation.bimonthlyExam}</Text>
                <Text style={styles.cell}>{evaluation.qualitativeAssessment}</Text>
                <Text style={styles.cell}>{evaluation.bimonthlyGrade}</Text>
                <Text style={styles.cell}>{evaluation.bimonthlyRecovery}</Text>
                <Text style={styles.cell}>{evaluation.bimonthlyAverage}</Text>
                <Text style={styles.cell}>{evaluation.totalAbsences}</Text>
              </View>
            ))}
          </View>

          {/* Aulas Dadas */}
          <Text style={[styles.bold, { marginTop: 10 }]}>Aulas Ministradas:</Text>
          {term.lessons.map((lesson, index) => (
            <Text key={index}>- {lesson.topic} Data: ({new Date(lesson.date).toLocaleDateString()}) - CH: {lesson.workload}</Text>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default GradebookPDF;