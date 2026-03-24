import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function PrivacyPolicy() {
  const router = useRouter();

  const sections = [
    {
      title: '1. Information We Collect',
      items: [
        'Sensitive Wellness Data: We collect your mood logs, journal reflections, and personal gratitude entries to provide our core wellness tracking service.',
        'Profile Information: Name, email address, registration number, course, and phone number provided during registration.',
        'User Content: Messages shared within the app\'s support system.',
        'Location Data: We collect your precise GPS location ONLY when you explicitly use the "Share My Location" feature in the Emergency tab for emergency assistance.',
        'Media: Profile pictures and community images selected via the system Photo Picker (no broad storage access required).'
      ]
    },
    {
      title: '2. How We Use and Protect Your Information',
      items: [
        'To provide personalized mental wellness support and trend tracking.',
        'To facilitate emergency assistance by sharing coordinates with designated responders during your active request.',
        'All data is encrypted in transit using industry-standard HTTPS/TLS protocols.',
        'We use Supabase (BaaS) for secure cloud infrastructure and authentication.'
      ]
    },
    {
      title: '3. Data Sharing and Disclosure',
      items: [
        'NO Selling: We NEVER sell your personal or sensitive mental health data to third parties.',
        'Emergency Responders: Your location is shared ONLY during an active emergency request you initiate.',
        'Service Providers: Data is processed by Supabase and Expo to facilitate core app functionality.'
      ]
    },
    {
      title: '4. Your Rights and Data Deletion',
      items: [
        'Personal Data Control: You can view and edit your profile in Settings.',
        'Permanent Deletion: You can delete your entire account and all associated data (journals, mood logs, messages) via the "Delete Account" button. This action permanently wipes data from both our cloud and your local device.'
      ]
    },
    {
      title: '5. Updates and Contact',
      items: [
        'We may update this policy periodically; changes will be posted within the app.',
        'Contact: Reach us at support@calmspace.com for any privacy concerns.'
      ]
    }
  ];

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundLight, Colors.accentLight]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.effectiveDate}>Effective Date: March 23, 2026</Text>
        <Text style={styles.introText}>
          Calm Space is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your information when you use the Calm Space mobile application.
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>6. Contact Us</Text>
          <Text style={styles.footerText}>
            If you have questions about this policy, please contact us at support@calmspace.com.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  effectiveDate: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
    fontWeight: '600',
  },
  introText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 18,
    color: Colors.primary,
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 21,
    flex: 1,
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});
