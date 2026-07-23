import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Premium Beige Color Palette
const colors = {
  bgDark: '#f7f4eb',       // Main page background (warm beige)
  bgLight: '#fdfcf7',      // Card/block background (light cream)
  accentGold: '#a67c1e',   // Accent gold (darker for readability on light bg)
  textLight: '#0d0d0c',    // Main dark text
  textMuted: '#5c564a',    // Muted body text
  borderGold: '#a67c1e',   // Gold borders
  borderDark: '#e3ded2',   // Soft light border
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bgDark,
    color: colors.textLight,
    fontFamily: 'Times-Roman',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  // Header / Footer layout
  pageContainer: {
    padding: 40,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    paddingBottom: 10,
    marginBottom: 20,
  },
  headerLeft: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    letterSpacing: 2,
    color: colors.textMuted,
  },
  headerRight: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    letterSpacing: 2,
    color: colors.accentGold,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    paddingTop: 10,
    marginTop: 20,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: colors.textMuted,
  },
  footerPageNum: {
    color: colors.accentGold,
  },

  // Cover Page Specific
  coverContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    backgroundColor: colors.bgDark,
    position: 'relative',
  },
  coverBorder: {
    position: 'absolute',
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
    borderWidth: 1,
    borderColor: colors.borderGold,
    opacity: 0.6,
  },
  coverLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  coverTitle: {
    fontSize: 36,
    fontFamily: 'Times-Roman',
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  coverTagline: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    letterSpacing: 4,
    color: colors.accentGold,
    textTransform: 'uppercase',
    marginBottom: 40,
  },
  coverImage: {
    width: '80%',
    height: 320,
    objectFit: 'cover',
    marginBottom: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
  },
  coverFooter: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 'auto',
  },

  // Grid/Layout Helpers
  title: {
    fontSize: 24,
    fontFamily: 'Times-Roman',
    marginBottom: 15,
    letterSpacing: 2,
    color: colors.accentGold,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  col2: {
    width: '48%',
  },
  col3: {
    width: '31%',
  },
  bodyText: {
    fontSize: 10.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
    color: colors.textMuted,
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
    lineHeight: 1.6,
    color: colors.textLight,
    marginBottom: 15,
  },

  // Stat Block
  statBlock: {
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'Times-Roman',
    color: colors.accentGold,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 7.5,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: 4,
  },

  // Pillar Card
  pillarCard: {
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 20,
    borderRadius: 8,
    height: '100%',
  },
  pillarTitle: {
    fontSize: 13,
    fontFamily: 'Times-Roman',
    color: colors.accentGold,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pillarBody: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: colors.textMuted,
  },

  // Services Row
  serviceItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
    color: colors.textLight,
  },
  serviceDetails: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: colors.textMuted,
  },

  // Portfolio Page Elements
  galleryImage: {
    width: '100%',
    height: 380,
    objectFit: 'cover',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 15,
  },
  galleryCaption: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
  galleryImageHalf: {
    width: '100%',
    height: 420,
    objectFit: 'cover',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderDark,
    marginBottom: 12,
  },
  galleryCaptionMini: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },

  // Step Timeline
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumberContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: colors.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: colors.bgLight,
  },
  stepNumber: {
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: colors.accentGold,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: 'Times-Roman',
    color: colors.textLight,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  stepBody: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: colors.textMuted,
  },

  // Testimonial Card
  testimonialCard: {
    backgroundColor: colors.bgLight,
    borderLeftWidth: 2,
    borderLeftColor: colors.accentGold,
    padding: 20,
    borderRadius: 4,
    marginBottom: 20,
  },
  testimonialQuote: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    lineHeight: 1.5,
    color: colors.textLight,
    marginBottom: 8,
  },
  testimonialAuthor: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.accentGold,
  },

  // Value Prop Blocks
  valueBlock: {
    backgroundColor: colors.bgLight,
    borderWidth: 1,
    borderColor: colors.borderDark,
    padding: 15,
    borderRadius: 6,
    marginBottom: 15,
  },
  valueTitle: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    color: colors.accentGold,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  valueBody: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: colors.textMuted,
  },

  // Contact list
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderDark,
  },
  contactLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: colors.accentGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  contactValue: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: colors.textLight,
  },
});

interface PortfolioPDFProps {
  images?: Record<string, any>; // Optional pre-loaded image buffers or base64 strings
}

export function PortfolioPDF({ images = {} }: PortfolioPDFProps) {
  // Helpers to resolve local paths
  const getPath = (relPath: string) => {
    if (images[relPath]) {
      return images[relPath];
    }
    return '/' + relPath.replace(/^\/+/, '');
  };

  return (
    <Document title="Timiclassic Luxury Portfolio" author="Timiclassic">
      {/* PAGE 1: COVER */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverContainer}>
          <View style={styles.coverBorder} />
          <Image src={getPath('logo.jpg')} style={styles.coverLogo} />
          <Text style={styles.coverTitle}>TIMICLASSIC</Text>
          <Text style={styles.coverTagline}>Luxury Bridal & Bespoke Fashion</Text>
          <Image src={getPath('dresses/couture-6.jpg')} style={styles.coverImage} />
          <Text style={styles.coverFooter}>Brand Portfolio</Text>
        </View>
      </Page>

      {/* PAGE 2: ABOUT THE BRAND */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>ABOUT THE BRAND</Text>
            </View>
            <Text style={styles.title}>Where Craft Meets Identity</Text>
            <Text style={styles.subtitle}>Our Legacy & Vision</Text>

            <View style={styles.row}>
              <View style={styles.col2}>
                <Text style={styles.highlightText}>
                  Founded in 2018, Timiclassic started as a visionary bespoke atelier in response to a growing need for unmatched precision and high-fashion couture.
                </Text>
                <Text style={styles.bodyText}>
                  We specialize in creating premium custom garments, ranging from structural bridal gowns that captivate the room, to vibrant, heritage-rich traditional outfits that celebrate identity and culture. Each piece is modeled and constructed to the wearer's unique dimensions, ensuring an absolute second-skin fit.
                </Text>
              </View>

              <View style={styles.col2}>
                <View style={styles.statBlock}>
                  <Text style={styles.statValue}>2018</Text>
                  <Text style={styles.statLabel}>Established</Text>
                </View>
                <View style={styles.statBlock}>
                  <Text style={styles.statValue}>800+</Text>
                  <Text style={styles.statLabel}>Garments Created</Text>
                </View>
                <View style={styles.statBlock}>
                  <Text style={styles.statValue}>100%</Text>
                  <Text style={styles.statLabel}>Bespoke & Unique Fits</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>02</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 3: THE PILLARS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>BRAND PILLARS</Text>
            </View>
            <Text style={styles.title}>Our Creative Philosophy</Text>
            <Text style={styles.subtitle}>The standards guiding every single stitch</Text>

            <View style={styles.row}>
              <View style={styles.col3}>
                <View style={styles.pillarCard}>
                  <Text style={styles.pillarTitle}>Uncompromising Fit</Text>
                  <Text style={styles.pillarBody}>
                    We take over 30 measurement checkpoints for every client. Our patterns are individually drafted to ensure an effortless, comfortable, and perfect posture alignment.
                  </Text>
                </View>
              </View>

              <View style={styles.col3}>
                <View style={styles.pillarCard}>
                  <Text style={styles.pillarTitle}>Structural Precision</Text>
                  <Text style={styles.pillarBody}>
                    From built-in corsetry to hand-sewn canvas interfacing, we sculpt the interior structure of our garments so they drape naturally and retain their majestic shape.
                  </Text>
                </View>
              </View>

              <View style={styles.col3}>
                <View style={styles.pillarCard}>
                  <Text style={styles.pillarTitle}>Heritage & Innovation</Text>
                  <Text style={styles.pillarBody}>
                    We honor rich fabrics (Aso-Oke, Brocade, Silk, Lace) and traditional weaving techniques, blending them seamlessly with modern cuts and contemporary styling.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>03</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 4: SERVICES */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>SERVICES & RANGE</Text>
            </View>
            <Text style={styles.title}>Bespoke Ateliers & Offerings</Text>
            <Text style={styles.subtitle}>Specialized segments designed for luxury consumer needs</Text>

            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Bridal Gowns</Text>
              <Text style={styles.serviceDetails}>Custom design, internal corsetry, custom hand-beading</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Reception & Evening Dresses</Text>
              <Text style={styles.serviceDetails}>Glamorous second-looks, silk drapes, and statement silhouettes</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Bridal Robes</Text>
              <Text style={styles.serviceDetails}>Satin, lace, and premium detailing for wedding mornings</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Bespoke Womenswear</Text>
              <Text style={styles.serviceDetails}>Tailored coordinates, corsets, blazer dresses, and formal wear</Text>
            </View>
            <View style={styles.serviceItem}>
              <Text style={styles.serviceName}>Alterations & Fitting Consultation</Text>
              <Text style={styles.serviceDetails}>Premium structural sizing and restoration of luxury garments</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>04</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 5: PORTFOLIO GALLERY - BRIDAL I */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>BRIDAL COUTURE I</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-3.jpg')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  Signature Bridal Gown — Hand-basted silk satin with structured inner boning.
                </Text>
              </View>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-4.jpg')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  A-Line Bridal Masterpiece — Elegant silk tulle, hand-beaded lace appliques.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>05</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 6: PORTFOLIO GALLERY - BRIDAL II */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>BRIDAL COUTURE II</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-1.jpg')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  Bespoke Bridal Satin — Sleek column dress with a dramatic chapel train.
                </Text>
              </View>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-2 (5).JPEG')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  Luxury Reception Gown — Shimmering sequin embroidery with structured drapes.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>06</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 7: PORTFOLIO GALLERY - HERITAGE & TRADITIONAL */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>HERITAGE & TRADITIONAL</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-7.jpg')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  Heritage Azure Aso-Oke — Reinterpreting traditional African heritage fabrics.
                </Text>
              </View>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-2 (13).JPEG')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  Premium Traditional Lace — Rich cultural textures meet clean structured lines.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>07</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 8: PORTFOLIO GALLERY - BESPOKE & EVENING WEAR */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>BESPOKE & EVENING WEAR</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-5.jpg')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  Sculpted Evening Corset — Made to exact measurements using blue drapes.
                </Text>
              </View>
              <View style={styles.col2}>
                <Image src={getPath('dresses/couture-2 (6).jpeg')} style={styles.galleryImageHalf} />
                <Text style={styles.galleryCaptionMini}>
                  Modern Blazer Coordinates — Crisp structural lines for high-fashion power.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>08</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 9: THE ATELIER JOURNEY */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>ATELIER EXPERIENCE</Text>
            </View>
            <Text style={styles.title}>The Client Experience</Text>
            <Text style={styles.subtitle}>How we translate ideas into couture masterpieces</Text>

            <View style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>01</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Consultation & Mapping</Text>
                <Text style={styles.stepBody}>
                  We understand the client's design vision, review styling inspirations, analyze fabric compositions, and create customized structural silhouette maps.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>02</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Custom Pattern Drafting & Measurements</Text>
                <Text style={styles.stepBody}>
                  Over 30 individual measurement points are charted. A unique paper pattern is designed from scratch, custom-fit to the client's specific posture and dimensions.
                </Text>
              </View>
            </View>

            <View style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>03</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Basting, Fitting & Final Assembly</Text>
                <Text style={styles.stepBody}>
                  The garment is assembled temporarily for trial fittings. Sizing adjustments are made to ensure a flawless second-skin fit before the final silk linings and closures are attached.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>09</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 10: CLIENT TESTIMONIALS */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>TESTIMONIALS</Text>
            </View>
            <Text style={styles.title}>Client Testimonials</Text>
            <Text style={styles.subtitle}>Feedback from our luxury clientele</Text>

            <View style={styles.testimonialCard}>
              <Text style={styles.testimonialQuote}>
                "Thank you for everything Timmi. Definitely my certified seamstress from now on."
              </Text>
              <Text style={styles.testimonialAuthor}>— Mumbi, UK</Text>
            </View>

            <View style={styles.testimonialCard}>
              <Text style={styles.testimonialQuote}>
                "When it comes to fashion, Nigerians rarely disappoints. Thank you Timi."
              </Text>
              <Text style={styles.testimonialAuthor}>— Namoonga, Uganda</Text>
            </View>

            <View style={styles.testimonialCard}>
              <Text style={styles.testimonialQuote}>
                "She is impressed and loves it, everybody does."
              </Text>
              <Text style={styles.testimonialAuthor}>— Blessing, Lagos</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>10</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 11: INVESTOR OPPORTUNITY */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>INVESTOR BRIEFING</Text>
            </View>
            <Text style={styles.title}>Investor Value Proposition</Text>
            <Text style={styles.subtitle}>Scaling luxury bespoke operations</Text>

            <View style={styles.valueBlock}>
              <Text style={styles.valueTitle}>Bespoke Model Scale & Efficiency</Text>
              <Text style={styles.valueBody}>
                Unlike traditional high-inventory fashion brands, our bespoke client portal model enables on-demand production. Since every garment is fully paid and customized, we maintain near-zero inventory risk and optimize resource utilization.
              </Text>
            </View>

            <View style={styles.valueBlock}>
              <Text style={styles.valueTitle}>Strong Unit Economics</Text>
              <Text style={styles.valueBody}>
                High average order value (AOV) driven by structural bridal gowns and premium heritage designs yields excellent gross margins. Repeat clients represent over 40% of our seasonal order book.
              </Text>
            </View>

            <View style={styles.valueBlock}>
              <Text style={styles.valueTitle}>Proprietary Client Digital System</Text>
              <Text style={styles.valueBody}>
                By integrating a proprietary online designer console and client portal, we streamline measurements, order tracking, invoice downloads, and fit updates, creating a modern SaaS-like operations flow for a luxury retail brand.
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>11</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 12: CONTACT */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageContainer}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerLeft}>TIMICLASSIC PORTFOLIO</Text>
              <Text style={styles.headerRight}>GET IN TOUCH</Text>
            </View>
            <Text style={styles.title}>Atelier & Partnerships</Text>
            <Text style={styles.subtitle}>Connecting with Timiclassic</Text>

            <Text style={styles.highlightText}>
              For private bespoke bookings, editorial features, or investor relations inquiries, please connect with our team.
            </Text>

            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+2347058255440</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Instagram</Text>
              <Text style={styles.contactValue}>@timiclassic_</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>Sophiaaina3@gmail.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Atelier Address</Text>
              <Text style={styles.contactValue}>Lagos, Nigeria</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>© Timiclassic Bespoke Clothing</Text>
            <Text style={styles.footerPageNum}>12</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

const RelReg = /^\/+/;
