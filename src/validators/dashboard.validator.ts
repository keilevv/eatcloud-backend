import { query, ValidationChain } from 'express-validator';
import {
  BENEFICIARY_STATUSES,
  BENEFICIARY_TYPES,
  RISK_LEVELS,
} from '../constants';

export const dashboardFilterValidator: ValidationChain[] = [
  query('donor').optional().isString().trim().notEmpty(),
  query('donationPoint').optional().isString().trim().notEmpty(),
  query('city').optional().isString().trim().notEmpty(),
  query('department').optional().isString().trim().notEmpty(),
  query('riskLevel')
    .optional()
    .isIn([...RISK_LEVELS])
    .withMessage(`riskLevel must be one of: ${RISK_LEVELS.join(', ')}`),
  query('beneficiaryType')
    .optional()
    .isIn([...BENEFICIARY_TYPES])
    .withMessage(
      `beneficiaryType must be one of: ${BENEFICIARY_TYPES.join(', ')}`,
    ),
  query('beneficiaryStatus')
    .optional()
    .isIn([...BENEFICIARY_STATUSES])
    .withMessage(
      `beneficiaryStatus must be one of: ${BENEFICIARY_STATUSES.join(', ')}`,
    ),
  query('limit')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 500 })
    .withMessage('limit must be a positive integer between 1 and 500'),
];
