import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer';
import { experienceFieldToPT } from '../../utils/helper';

// Estilos aprimorados
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica'
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#0080ff',
        fontWeight: 'bold',
        borderBottom: '1 solid #0080ff',
        paddingBottom: 4
    },
    section: {
        marginBottom: 15
    },
    card: {
        padding: 10,
        border: '1 solid #ccc',
        borderRadius: 5,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 6,
        fontWeight: 'bold',
        color: '#0080ff',
        borderBottom: '1 solid #0080ff',
        paddingBottom: 2
    },
    infoText: {
        fontSize: 10,
        marginBottom: 2
    },
    topic: {
        fontSize: 10,
        marginBottom: 2
    },
    studentName: {
        fontSize: 11,
        marginBottom: 4,
        fontWeight: 'bold',
        color: '#0080ff'
    },
    label: {
        fontWeight: 'bold'
    }
});

const TermKGToPDF = ({ gradebook, term }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>Caderneta </Text>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Informações Gerais</Text>
                <Text style={styles.infoText}><Text style={styles.label}>Bimestre:</Text> {term.name}</Text>
                <Text style={styles.infoText}><Text style={styles.label}>Professor:</Text> {gradebook.teacher.name}</Text>
                <Text style={styles.infoText}>
                    <Text style={styles.label}>Turma:</Text> {gradebook.classroom.grade} ({gradebook.classroom.shift})
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Aulas Ministradas</Text>
                {term.lessons.map((lesson, index) => (
                    <View key={lesson._id} style={styles.card}>
                        <Text style={styles.topic}>
                            {index + 1}. {new Date(lesson.date).toLocaleDateString()} - {lesson.topic}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.subtitle}>Notas e Faltas dos Alunos</Text>
                {term.studentEvaluations.map((evaluation, index) => (
                    <View key={evaluation._id} style={styles.card}>
                        <Text style={styles.studentName}>
                            {index + 1}. {evaluation.student.name}
                        </Text>
                        {evaluation.evaluations.map((field, i) => (
                            <Text key={i} style={styles.infoText}>
                                <Text style={styles.label}>{field.fieldName}:</Text> {experienceFieldToPT(field.evaluationCriteria)}
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default TermKGToPDF;