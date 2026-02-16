/**
 * Calcite Components for React
 * 
 * Re-exports the official Calcite React components from @esri/calcite-components-react
 * These are web components wrapped with @lit/react for seamless React integration
 * 
 * @see https://developers.arcgis.com/calcite-design-system/components/
 */

// Import setAssetPath to configure Calcite assets
import { setAssetPath } from '@esri/calcite-components/dist/components';

// Set the asset path for Calcite icons and other assets
// This needs to be called before using any Calcite components
setAssetPath('https://js.arcgis.com/calcite-components/2.5.1/assets');

// Re-export all Calcite React components
export {
  CalciteAction,
  CalciteActionBar,
  CalciteActionGroup,
  CalciteActionMenu,
  CalciteActionPad,
  CalciteAlert,
  CalciteAvatar,
  CalciteBlock,
  CalciteBlockSection,
  CalciteButton,
  CalciteCard,
  CalciteCheckbox,
  CalciteChip,
  CalciteChipGroup,
  CalciteCombobox,
  CalciteComboboxItem,
  CalciteComboboxItemGroup,
  CalciteDatePicker,
  CalciteDialog,
  CalciteDropdown,
  CalciteDropdownGroup,
  CalciteDropdownItem,
  CalciteFab,
  CalciteFilter,
  CalciteFlow,
  CalciteFlowItem,
  CalciteIcon,
  CalciteInput,
  CalciteInputDatePicker,
  CalciteInputMessage,
  CalciteInputNumber,
  CalciteInputText,
  CalciteInputTimeZone,
  CalciteLabel,
  CalciteLink,
  CalciteList,
  CalciteListItem,
  CalciteListItemGroup,
  CalciteLoader,
  CalciteMenu,
  CalciteMenuItem,
  CalciteModal,
  CalciteNavigation,
  CalciteNavigationLogo,
  CalciteNavigationUser,
  CalciteNotice,
  CalciteOption,
  CalciteOptionGroup,
  CalcitePagination,
  CalcitePanel,
  CalcitePopover,
  CalciteProgress,
  CalciteRadioButton,
  CalciteRadioButtonGroup,
  CalciteRating,
  CalciteScrim,
  CalciteSegmentedControl,
  CalciteSegmentedControlItem,
  CalciteSelect,
  CalciteShell,
  CalciteShellCenterRow,
  CalciteShellPanel,
  CalciteSlider,
  CalciteStepper,
  CalciteStepperItem,
  CalciteSwitch,
  CalciteTab,
  CalciteTabNav,
  CalciteTabTitle,
  CalciteTabs,
  CalciteTextArea,
  CalciteTip,
  CalciteTipGroup,
  CalciteTipManager,
  CalciteTooltip,
  CalciteTree,
  CalciteTreeItem,
  CalciteValueList,
  CalciteValueListItem
} from '@esri/calcite-components-react';

// Note: Custom event types are not exported by @esri/calcite-components-react
// Use the standard React event types instead (e.g., onCalciteSelectChange, onCalciteSwitchChange)
