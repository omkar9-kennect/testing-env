export default defineNuxtPlugin(() => {
  return {
    provide: {
      searchFunc(searchedText, inputList, searchParams) {
        return inputList.filter((element) => {
          return this.$regexSearch(searchedText, searchParams, element);
        });
      },

      getObjectPropertyValueByPathInString(obj = {}, path = '') {
        path = path.split('.');
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]];
        }
        return obj;
      },

      regexSearch(searchedText, searchParams, elem) {
        if (!searchedText) {
          return true;
        }
        let re = new RegExp(
          searchedText.replace(
            /[`~!@#$%^&*()_|+\-=?;:'",.<>\s\{\}\[\]\\\/]/gi,
            ''
          ),
          'gi'
        );

        for (let i = 0; i < searchParams.length; i++) {
          let term = this.$getObjectPropertyValueByPathInString(
            elem,
            searchParams[i]
          );
          if (!term) {
            continue;
          }
          if (
            term
              .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\s\{\}\[\]\\\/]/gi, '')
              .match(re)
          ) {
            return true;
          }
        }
        return false;
      },

      isDatasetConfigComplete(datasetConfig) {
        try {
          if (!datasetConfig) {
            throw new Error('datasetConfig is missing.');
          }
          const incompleteSteps = [];
          const incompleteStepsIssues = {
            datasetAttributes: [],
            fieldDeclaration: [],
            buMapping: [],
            modeConfiguration: [],
          };

          let isDatasetConfigComplete = true;

          function isDatasetAttributesConfigComplete() {
            if (!datasetConfig.displayName) {
              incompleteStepsIssues['datasetAttributes'].push(
                'displayName missing'
              );
              incompleteSteps.push('datasetAttributes');
              return false;
            }
            if (!datasetConfig.dsType) {
              incompleteStepsIssues['datasetAttributes'].push('dsType missing');
              incompleteSteps.push('datasetAttributes');
              return false;
            }

            if (
              !datasetConfig.setup?.inputModeTypes?.hasOwnProperty('upload') ||
              !datasetConfig.setup?.inputModeTypes?.hasOwnProperty('CRUD') ||
              !datasetConfig.setup?.inputModeTypes?.hasOwnProperty('sync')
            ) {
              incompleteStepsIssues['datasetAttributes'].push(
                'inputModeTypes missing'
              );
              incompleteSteps.push('datasetAttributes');
              return false;
            }
            if (!datasetConfig.setup?.attributes?.hasOwnProperty('sensitive')) {
              incompleteStepsIssues['datasetAttributes'].push(
                'sensitive missing'
              );
              incompleteSteps.push('datasetAttributes');
              return false;
            }
            if (
              !datasetConfig.setup?.attributes?.hasOwnProperty(
                'partitionEnable'
              )
            ) {
              incompleteStepsIssues['datasetAttributes'].push(
                'partitionEnable missing'
              );
              incompleteSteps.push('datasetAttributes');
              return false;
            }

            return true;
          }

          function isFieldDeclarationConfigComplete() {
            if (!datasetConfig.setup?.fieldSet) {
              incompleteStepsIssues['fieldDeclaration'].push(
                'fieldSet missing'
              );
              incompleteSteps.push('fieldDeclaration');
              return false;
            }

            if (datasetConfig.setup?.fieldSet?.length === 0) {
              incompleteStepsIssues['fieldDeclaration'].push(
                'fieldSet length is 0'
              );
              incompleteSteps.push('fieldDeclaration');
              return false;
            }

            if (!datasetConfig.setup?.validation) {
              incompleteStepsIssues['fieldDeclaration'].push(
                'Validation object missing in setup.'
              );
              incompleteSteps.push('fieldDeclaration');
              return false;
            }

            const isFieldPresentInValidation = Object.keys(
              datasetConfig.setup?.validation
            );

            if (isFieldPresentInValidation.length === 0) {
              incompleteStepsIssues['fieldDeclaration'].push(
                'Validation object is empty.'
              );
              incompleteSteps.push('fieldDeclaration');
              return false;
            }

            let isFieldObjIncomplete = false;
            for (const field of datasetConfig.setup?.fieldSet) {
              if (!field.text) {
                isFieldObjIncomplete = true;
                break;
              }
              if (!field.value) {
                isFieldObjIncomplete = true;
                break;
              }
              if (!field.type) {
                isFieldObjIncomplete = true;
                break;
              }

              if (field.type === 'Period') {
                if (!field.format || field.format.length === 0) {
                  isFieldObjIncomplete = true;
                  break;
                }
              }

              if (datasetConfig.setup?.inputModeTypes?.upload === true) {
                if (!field.uploadSourceKey) {
                  isFieldObjIncomplete = true;
                  break;
                }
              }
              if (datasetConfig.setup?.inputModeTypes?.sync === true) {
                if (!field.channelSourceKey) {
                  isFieldObjIncomplete = true;
                  break;
                }
              }

              if (!field?.label?.length === 0) {
                isFieldObjIncomplete = true;
                break;
              }

              //Field validation completeness check

              const fieldObjFromValidationObj =
                datasetConfig.setup?.validation[field.value];

              if (!fieldObjFromValidationObj) {
                isFieldObjIncomplete = true;
                break;
              }

              if (
                !(
                  fieldObjFromValidationObj.hasOwnProperty('transformOperation') &&
                  fieldObjFromValidationObj.hasOwnProperty('isMandatory') &&
                  fieldObjFromValidationObj.hasOwnProperty('isUnique') &&
                  fieldObjFromValidationObj.hasOwnProperty('isNotNull')
                )
              ) {
                isFieldObjIncomplete = true;
                break;
              }
              if (fieldObjFromValidationObj.transformOperation.length === 0) {
                isFieldObjIncomplete = true;
                break;
              }

              if (
                !(
                  fieldObjFromValidationObj.isMandatory.hasOwnProperty(
                    'isSelected'
                  ) &&
                  fieldObjFromValidationObj.isMandatory.hasOwnProperty(
                    'isBreaking'
                  )
                )
              ) {
                isFieldObjIncomplete = true;
                break;
              }

              if (
                !(
                  fieldObjFromValidationObj.isUnique.hasOwnProperty(
                    'isSelected'
                  ) &&
                  fieldObjFromValidationObj.isUnique.hasOwnProperty(
                    'isBreaking'
                  )
                )
              ) {
                isFieldObjIncomplete = true;
                break;
              }

              if (
                !(
                  fieldObjFromValidationObj.isNotNull.hasOwnProperty(
                    'isSelected'
                  ) &&
                  fieldObjFromValidationObj.isNotNull.hasOwnProperty(
                    'isBreaking'
                  )
                )
              ) {
                isFieldObjIncomplete = true;
                break;
              }
            }
            if (isFieldObjIncomplete) {
              incompleteStepsIssues['fieldDeclaration'].push(
                'fieldSet object is incomplete'
              );
              incompleteSteps.push('fieldDeclaration');
              return false;
            }

            return true;
          }

          function isBuMappingConfigComplete() {
            if (!datasetConfig.setup?.attributes?.buContextField) {
              incompleteStepsIssues['buMapping'].push('buContextField missing');
              incompleteSteps.push('buMapping');
              return false;
            }
            return true;
          }

          function isModeConfigurationConfigComplete() {
            if (!datasetConfig.setup?.ingress?.mode) {
              incompleteStepsIssues['modeConfiguration'].push('mode missing');
              incompleteSteps.push('modeConfiguration');
              return false;
            }

            if (datasetConfig.setup?.ingress?.mode === 'append') {
              if (!datasetConfig.setup?.ingress?.appendKeys?.length === 0) {
                incompleteStepsIssues['modeConfiguration'].push(
                  'appendKeys missing'
                );
                incompleteSteps.push('modeConfiguration');
                return false;
              }
            }
            return true;
          }

          //Dataset attributes configuration
          if (!isDatasetAttributesConfigComplete()) {
            isDatasetConfigComplete = false;
          }

          //Field declaration configuration
          if (!isFieldDeclarationConfigComplete()) {
            isDatasetConfigComplete = false;
          }

          //BU mapping configuration
          if (datasetConfig.setup?.attributes?.partitionEnable === true) {
            if (!isBuMappingConfigComplete()) {
              isDatasetConfigComplete = false;
            }
          }

          //Mode configuration
          if (
            datasetConfig.setup?.inputModeTypes?.sync === true ||
            datasetConfig.setup?.inputModeTypes?.upload === true
          ) {
            if (!isModeConfigurationConfigComplete()) {
              isDatasetConfigComplete = false;
            }
          }

          console.log('incompleteStepsIssues', incompleteStepsIssues);

          return {
            ok: isDatasetConfigComplete,
            incompleteSteps: incompleteSteps,
          };
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
});

// NOTE: you can access above functions as this.$METHOD_NAME() in any vue file
