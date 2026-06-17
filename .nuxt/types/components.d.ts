
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  AdminDashboardChart: typeof import("../../components/AdminDashboardChart.vue")['default']
  AdminSidebar: typeof import("../../components/AdminSidebar.vue")['default']
  AdminTopBar: typeof import("../../components/AdminTopBar.vue")['default']
  ParentDocCardIcon: typeof import("../../components/ParentDocCardIcon.vue")['default']
  RevealSection: typeof import("../../components/RevealSection.vue")['default']
  SiteFooter: typeof import("../../components/SiteFooter.vue")['default']
  SiteHeader: typeof import("../../components/SiteHeader.vue")['default']
  AdminAccountingTotalsBlocks: typeof import("../../components/admin/AdminAccountingTotalsBlocks.vue")['default']
  AdminClassEditModal: typeof import("../../components/admin/AdminClassEditModal.vue")['default']
  AdminLevelEditModal: typeof import("../../components/admin/AdminLevelEditModal.vue")['default']
  AdminServiceEditModal: typeof import("../../components/admin/AdminServiceEditModal.vue")['default']
  AdminStudentCarnetSuivi: typeof import("../../components/admin/AdminStudentCarnetSuivi.vue")['default']
  AdminStudentFicheSante: typeof import("../../components/admin/AdminStudentFicheSante.vue")['default']
  EnrollmentFamilySectionHeader: typeof import("../../components/enrollment/EnrollmentFamilySectionHeader.vue")['default']
  EnrollmentField: typeof import("../../components/enrollment/EnrollmentField.vue")['default']
  EnrollmentNavFooter: typeof import("../../components/enrollment/EnrollmentNavFooter.vue")['default']
  EnrollmentParentSignature: typeof import("../../components/enrollment/EnrollmentParentSignature.vue")['default']
  EnrollmentRecapBlock: typeof import("../../components/enrollment/EnrollmentRecapBlock.vue")['default']
  EnrollmentRecapCard: typeof import("../../components/enrollment/EnrollmentRecapCard.vue")['default']
  EnrollmentRecapRow: typeof import("../../components/enrollment/EnrollmentRecapRow.vue")['default']
  EnrollmentSectionTitle: typeof import("../../components/enrollment/EnrollmentSectionTitle.vue")['default']
  EnrollmentStepEnfant: typeof import("../../components/enrollment/EnrollmentStepEnfant.vue")['default']
  EnrollmentStepFamille: typeof import("../../components/enrollment/EnrollmentStepFamille.vue")['default']
  EnrollmentStepOptions: typeof import("../../components/enrollment/EnrollmentStepOptions.vue")['default']
  EnrollmentStepSante: typeof import("../../components/enrollment/EnrollmentStepSante.vue")['default']
  EnrollmentStepValidation: typeof import("../../components/enrollment/EnrollmentStepValidation.vue")['default']
  EnrollmentStepper: typeof import("../../components/enrollment/EnrollmentStepper.vue")['default']
  EnrollmentWizardHeader: typeof import("../../components/enrollment/EnrollmentWizardHeader.vue")['default']
  ParentChildOverviewCard: typeof import("../../components/parent/ParentChildOverviewCard.vue")['default']
  ParentPayTuitionInline: typeof import("../../components/parent/PayTuitionInline.vue")['default']
  ParentPayTuitionModal: typeof import("../../components/parent/PayTuitionModal.vue")['default']
  ParentChildSpaceCarnet: typeof import("../../components/parent/child-space/ParentChildSpaceCarnet.vue")['default']
  ParentChildSpaceHeader: typeof import("../../components/parent/child-space/ParentChildSpaceHeader.vue")['default']
  ParentChildSpaceProfil: typeof import("../../components/parent/child-space/ParentChildSpaceProfil.vue")['default']
  ParentChildSpaceSante: typeof import("../../components/parent/child-space/ParentChildSpaceSante.vue")['default']
  ParentChildSpaceTabs: typeof import("../../components/parent/child-space/ParentChildSpaceTabs.vue")['default']
  ParentChildSpaceTypes: typeof import("../../components/parent/child-space/types")['default']
  ParentOnboardingShell: typeof import("../../components/parent/onboarding/ParentOnboardingShell.vue")['default']
  ParentOnboardingSlide1: typeof import("../../components/parent/onboarding/ParentOnboardingSlide1.vue")['default']
  ParentOnboardingSlide2: typeof import("../../components/parent/onboarding/ParentOnboardingSlide2.vue")['default']
  ParentOnboardingSlide3: typeof import("../../components/parent/onboarding/ParentOnboardingSlide3.vue")['default']
  ParentOnboardingSlide4: typeof import("../../components/parent/onboarding/ParentOnboardingSlide4.vue")['default']
  ParentOnboardingTitle: typeof import("../../components/parent/onboarding/ParentOnboardingTitle.vue")['default']
  NuxtWelcome: typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtLinkLocale: typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']
  SwitchLocalePathLink: typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']
  NuxtPage: typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']
  NoScript: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyAdminDashboardChart: LazyComponent<typeof import("../../components/AdminDashboardChart.vue")['default']>
  LazyAdminSidebar: LazyComponent<typeof import("../../components/AdminSidebar.vue")['default']>
  LazyAdminTopBar: LazyComponent<typeof import("../../components/AdminTopBar.vue")['default']>
  LazyParentDocCardIcon: LazyComponent<typeof import("../../components/ParentDocCardIcon.vue")['default']>
  LazyRevealSection: LazyComponent<typeof import("../../components/RevealSection.vue")['default']>
  LazySiteFooter: LazyComponent<typeof import("../../components/SiteFooter.vue")['default']>
  LazySiteHeader: LazyComponent<typeof import("../../components/SiteHeader.vue")['default']>
  LazyAdminAccountingTotalsBlocks: LazyComponent<typeof import("../../components/admin/AdminAccountingTotalsBlocks.vue")['default']>
  LazyAdminClassEditModal: LazyComponent<typeof import("../../components/admin/AdminClassEditModal.vue")['default']>
  LazyAdminLevelEditModal: LazyComponent<typeof import("../../components/admin/AdminLevelEditModal.vue")['default']>
  LazyAdminServiceEditModal: LazyComponent<typeof import("../../components/admin/AdminServiceEditModal.vue")['default']>
  LazyAdminStudentCarnetSuivi: LazyComponent<typeof import("../../components/admin/AdminStudentCarnetSuivi.vue")['default']>
  LazyAdminStudentFicheSante: LazyComponent<typeof import("../../components/admin/AdminStudentFicheSante.vue")['default']>
  LazyEnrollmentFamilySectionHeader: LazyComponent<typeof import("../../components/enrollment/EnrollmentFamilySectionHeader.vue")['default']>
  LazyEnrollmentField: LazyComponent<typeof import("../../components/enrollment/EnrollmentField.vue")['default']>
  LazyEnrollmentNavFooter: LazyComponent<typeof import("../../components/enrollment/EnrollmentNavFooter.vue")['default']>
  LazyEnrollmentParentSignature: LazyComponent<typeof import("../../components/enrollment/EnrollmentParentSignature.vue")['default']>
  LazyEnrollmentRecapBlock: LazyComponent<typeof import("../../components/enrollment/EnrollmentRecapBlock.vue")['default']>
  LazyEnrollmentRecapCard: LazyComponent<typeof import("../../components/enrollment/EnrollmentRecapCard.vue")['default']>
  LazyEnrollmentRecapRow: LazyComponent<typeof import("../../components/enrollment/EnrollmentRecapRow.vue")['default']>
  LazyEnrollmentSectionTitle: LazyComponent<typeof import("../../components/enrollment/EnrollmentSectionTitle.vue")['default']>
  LazyEnrollmentStepEnfant: LazyComponent<typeof import("../../components/enrollment/EnrollmentStepEnfant.vue")['default']>
  LazyEnrollmentStepFamille: LazyComponent<typeof import("../../components/enrollment/EnrollmentStepFamille.vue")['default']>
  LazyEnrollmentStepOptions: LazyComponent<typeof import("../../components/enrollment/EnrollmentStepOptions.vue")['default']>
  LazyEnrollmentStepSante: LazyComponent<typeof import("../../components/enrollment/EnrollmentStepSante.vue")['default']>
  LazyEnrollmentStepValidation: LazyComponent<typeof import("../../components/enrollment/EnrollmentStepValidation.vue")['default']>
  LazyEnrollmentStepper: LazyComponent<typeof import("../../components/enrollment/EnrollmentStepper.vue")['default']>
  LazyEnrollmentWizardHeader: LazyComponent<typeof import("../../components/enrollment/EnrollmentWizardHeader.vue")['default']>
  LazyParentChildOverviewCard: LazyComponent<typeof import("../../components/parent/ParentChildOverviewCard.vue")['default']>
  LazyParentPayTuitionInline: LazyComponent<typeof import("../../components/parent/PayTuitionInline.vue")['default']>
  LazyParentPayTuitionModal: LazyComponent<typeof import("../../components/parent/PayTuitionModal.vue")['default']>
  LazyParentChildSpaceCarnet: LazyComponent<typeof import("../../components/parent/child-space/ParentChildSpaceCarnet.vue")['default']>
  LazyParentChildSpaceHeader: LazyComponent<typeof import("../../components/parent/child-space/ParentChildSpaceHeader.vue")['default']>
  LazyParentChildSpaceProfil: LazyComponent<typeof import("../../components/parent/child-space/ParentChildSpaceProfil.vue")['default']>
  LazyParentChildSpaceSante: LazyComponent<typeof import("../../components/parent/child-space/ParentChildSpaceSante.vue")['default']>
  LazyParentChildSpaceTabs: LazyComponent<typeof import("../../components/parent/child-space/ParentChildSpaceTabs.vue")['default']>
  LazyParentChildSpaceTypes: LazyComponent<typeof import("../../components/parent/child-space/types")['default']>
  LazyParentOnboardingShell: LazyComponent<typeof import("../../components/parent/onboarding/ParentOnboardingShell.vue")['default']>
  LazyParentOnboardingSlide1: LazyComponent<typeof import("../../components/parent/onboarding/ParentOnboardingSlide1.vue")['default']>
  LazyParentOnboardingSlide2: LazyComponent<typeof import("../../components/parent/onboarding/ParentOnboardingSlide2.vue")['default']>
  LazyParentOnboardingSlide3: LazyComponent<typeof import("../../components/parent/onboarding/ParentOnboardingSlide3.vue")['default']>
  LazyParentOnboardingSlide4: LazyComponent<typeof import("../../components/parent/onboarding/ParentOnboardingSlide4.vue")['default']>
  LazyParentOnboardingTitle: LazyComponent<typeof import("../../components/parent/onboarding/ParentOnboardingTitle.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtLinkLocale: LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/NuxtLinkLocale")['default']>
  LazySwitchLocalePathLink: LazyComponent<typeof import("../../node_modules/@nuxtjs/i18n/dist/runtime/components/SwitchLocalePathLink")['default']>
  LazyNuxtPage: LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page")['default']>
  LazyNoScript: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
