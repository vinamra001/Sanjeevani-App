import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions, Modal, Platform
} from 'react-native';

const { width } = Dimensions.get('window');
const THEME_COLOR = '#2D7D46';

const BLOG_POSTS = [
  {
    id: '1',
    title: 'Understanding the Three Doshas: Vata, Pitta, and Kapha',
    category: 'Wellness',
    author: 'Dr. Anjali Sharma',
    readTime: '5 min read',
    excerpt: 'Ayurveda is built upon the concept of three fundamental energies...',
    content: "Ayurveda, the ancient Indian system of medicine, is built upon the concept of three fundamental energies called doshas: Vata, Pitta, and Kapha. \n\n1. Vata (Air & Space): Governs movement and creativity. When out of balance, it leads to anxiety and insomnia.\n\n2. Pitta (Fire & Water): Governs metabolism and intelligence. Imbalance leads to anger and inflammation.\n\n3. Kapha (Earth & Water): Governs structure and lubrication. Imbalance leads to lethargy and weight gain.\n\nTo maintain health, one must balance these energies through proper diet, lifestyle, and seasonal routines (Ritucharya)."
  },
  {
    id: '2',
    title: 'The Healing Power of Turmeric in Ayurveda',
    category: 'Herbs',
    author: 'Dr. Rajesh Patel',
    readTime: '4 min read',
    excerpt: 'Turmeric, known as Haridra, is one of the most revered herbs...',
    content: "Turmeric (Curcuma longa) is the 'Golden Spice' of Ayurveda. It contains curcumin, a powerful anti-inflammatory and antioxidant.\n\nIn Ayurvedic practice, Haridra is used for:\n• Improving skin complexion and healing wounds.\n• Boosting immunity through 'Golden Milk' (Haldi Doodh).\n• Detoxifying the liver and purifying the blood.\n\nPro-tip: Always consume turmeric with a pinch of black pepper. The piperine in black pepper increases the absorption of curcumin by 2000%!"
  }
];

const BlogScreen = ({ navigation }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  const NavItem = ({ icon, label, active, onPress }) => (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Text style={[styles.navIcon, active && { color: THEME_COLOR }]}>{icon}</Text>
      <Text style={[styles.navLabel, active && { color: THEME_COLOR, fontWeight: 'bold' }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />

      {/* FIXED UNIFIED HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayurvedic Insights</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeading}>Explore Wellness Articles</Text>

        {/* LIST OF POSTS */}
        {BLOG_POSTS.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.blogCard}
            activeOpacity={0.9}
            onPress={() => setSelectedPost(post)}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.tag}><Text style={styles.tagText}>{post.category}</Text></View>
              <Text style={{ fontSize: 20 }}>🔖</Text>
            </View>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.excerpt}>{post.excerpt}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>👤 {post.author}  |  🕒 {post.readTime}</Text>
              <Text style={styles.readMore}>Read More →</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- DYNAMIC POST MODAL --- */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={selectedPost !== null}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor={THEME_COLOR} />
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSelectedPost(null)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Article Details</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalCategory}>{selectedPost?.category}</Text>
            <Text style={styles.modalTitle}>{selectedPost?.title}</Text>
            <View style={styles.modalAuthorRow}>
                <Text style={styles.modalAuthor}>By {selectedPost?.author}</Text>
                <Text style={styles.modalTime}>{selectedPost?.readTime}</Text>
            </View>

            <View style={styles.contentDivider} />

            {selectedPost?.id === '1' && (
               <View style={styles.diagramPlaceholder}>

               </View>
            )}

            <Text style={styles.fullContentText}>{selectedPost?.content}</Text>

            {selectedPost?.id === '2' && (
               <View style={styles.diagramPlaceholder}>

               </View>
            )}

            <View style={styles.footerInfoBox}>
                <Text style={styles.infoBoxText}>Sanjeevani AI Educational Resources</Text>
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <NavItem icon="🏠" label="Home" onPress={() => navigation.navigate('Home')} />
        <NavItem icon="📋" label="Blogs" active />
        <NavItem icon="💬" label="Chat" onPress={() => navigation.navigate('Chat')} />
        <NavItem icon="👤" label="Profile" onPress={() => navigation.navigate('Profile')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAF8' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    backgroundColor: THEME_COLOR,
    elevation: 8,
  },
  backButton: { padding: 5 },
  backArrow: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  sectionHeading: { fontSize: 18, fontWeight: '700', color: '#1B5E20', marginBottom: 15 },
  blogCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  tag: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  tagText: { fontWeight: 'bold', fontSize: 12, color: THEME_COLOR, textTransform: 'uppercase' },
  postTitle: { fontSize: 22, fontWeight: 'bold', color: '#1B5E20', marginBottom: 10, lineHeight: 28 },
  excerpt: { color: '#555', fontSize: 14, lineHeight: 22, marginBottom: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 15 },
  footerText: { color: '#999', fontSize: 12 },
  readMore: { color: THEME_COLOR, fontWeight: 'bold' },

  // MODAL STYLES
  modalContainer: { flex: 1, backgroundColor: '#FFF' },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    backgroundColor: THEME_COLOR
  },
  closeButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalHeaderText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  modalContent: { padding: 25 },
  modalCategory: { fontSize: 12, fontWeight: 'bold', color: THEME_COLOR, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  modalTitle: { fontSize: 28, fontWeight: 'bold', color: '#1B5E20', lineHeight: 36 },
  modalAuthorRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  modalAuthor: { color: '#666', fontWeight: '600', fontSize: 15 },
  modalTime: { color: '#999', fontSize: 14 },
  contentDivider: { height: 4, backgroundColor: THEME_COLOR, width: 50, marginVertical: 25, borderRadius: 2 },
  diagramPlaceholder: { marginVertical: 10, padding: 10, backgroundColor: '#F8FAF8', borderRadius: 15 },
  fullContentText: { fontSize: 17, color: '#333', lineHeight: 28, fontWeight: '400' },
  footerInfoBox: { marginTop: 40, padding: 20, backgroundColor: '#F1F8E9', borderRadius: 15 },
  infoBoxText: { color: '#4D7C59', fontSize: 13, textAlign: 'center', fontWeight: '500' },

  bottomNav: {
    position: 'absolute', bottom: 0, width: width, height: 85,
    backgroundColor: '#FFF', flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEE', paddingBottom: 20
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIcon: { fontSize: 24, color: '#AAA' },
  navLabel: { fontSize: 10, color: '#AAA', marginTop: 4 },
});

export default BlogScreen;