<?php declare(strict_types=1);

namespace Shopware\Core\Framework\Test\Webhook\_fixtures\BusinessEvents;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\Event\EventData\EntityType;
use Shopware\Core\Framework\Event\EventData\EventDataCollection;
use Shopware\Core\Framework\Event\FlowEventAware;
use Shopware\Core\System\Tax\TaxDefinition;
use Shopware\Core\System\Tax\TaxEntity;

/**
 * @internal
 */
class EntityBusinessEvent implements FlowEventAware, BusinessEventEncoderTestInterface
{
    public function __construct(private readonly TaxEntity $tax)
    {
    }

    public static function getAvailableData(): EventDataCollection
    {
        return (new EventDataCollection())
            ->add('tax', new EntityType(TaxDefinition::class));
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    public function getEncodeValues(string $shopwareVersion): array
    {
        return [
            'tax' => [
                'id' => $this->tax->getId(),
                '_uniqueIdentifier' => $this->tax->getId(),
                'versionId' => null,
                'name' => $this->tax->getName(),
                'taxRate' => (int) $this->tax->getTaxRate(),
                'position' => $this->tax->getPosition(),
                'customFields' => null,
                'translated' => [],
                'createdAt' => $this->tax->getCreatedAt() ? $this->tax->getCreatedAt()->format(\DATE_RFC3339_EXTENDED) : null,
                'updatedAt' => null,
                'extensions' => [
                    'foreignKeys' => [
                        'extensions' => [],
                        'apiAlias' => 'tax_foreign_keys_extension',
                    ],
                ],
                'apiAlias' => 'tax',
            ],
        ];
    }

    public function getName(): string
    {
        return 'test';
    }

    public function getContext(): Context
    {
        return Context::createDefaultContext();
    }

    public function getTax(): TaxEntity
    {
        return $this->tax;
    }
}
