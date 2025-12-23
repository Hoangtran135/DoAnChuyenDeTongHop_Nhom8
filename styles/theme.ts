// Theme chung cho toàn bộ ứng dụng
export const theme = {
  colors: {
    // Primary colors
    primary: "#6A0DAD", // Màu tím chính
    primaryDark: "#5A0B9D",
    primaryLight: "#7A1FBD",
    
    // Accent colors
    accent: "#ff6200", // Màu cam
    accentLight: "#ff8533",
    
    // Secondary colors
    secondary: "#27ae60", // Màu xanh lá
    secondaryLight: "#2ecc71",
    
    // Background colors
    background: "#f5f5f5",
    backgroundLight: "#ffffff",
    backgroundGray: "#f9f9f9",
    backgroundMuted: "#f0f0f0",
    
    // Text colors
    text: "#333333",
    textSecondary: "#666666",
    textMuted: "#999999",
    textLight: "#ffffff",
    
    // Border colors
    border: "#e0e0e0",
    borderLight: "#eeeeee",
    borderDark: "#cccccc",
    
    // Status colors
    success: "#27ae60",
    error: "#e74c3c",
    warning: "#f39c12",
    info: "#3498db",
    
    // Shadow
    shadow: "#000000",
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 5,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },
  
  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  
  elevation: {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  },
  
  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 6,
    },
  },
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  containerLight: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  
  centeredContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: theme.colors.background,
  },
  
  card: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadow.sm,
  },
  
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...theme.shadow.sm,
  },
  
  buttonSecondary: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...theme.shadow.sm,
  },
  
  buttonDanger: {
    backgroundColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...theme.shadow.sm,
  },
  
  buttonText: {
    color: theme.colors.textLight,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  
  buttonTextLarge: {
    color: theme.colors.textLight,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
  },
  
  input: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 50,
  },
  
  inputGray: {
    backgroundColor: theme.colors.backgroundGray,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 50,
  },
  
  label: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  
  textSecondary: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  
  textMuted: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textMuted,
  },
  
  title: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: "center" as const,
  },
  
  titleLarge: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xxxl,
    letterSpacing: 0.5,
  },
  
  sectionTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  header: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
    textAlign: "center" as const,
  },
  
  price: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  
  priceLarge: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginVertical: theme.spacing.md,
  },
  
  footer: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  
  emptyStateText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: "center" as const,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: theme.colors.background,
  },
};

