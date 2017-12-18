<?php declare(strict_types=1);

namespace Shopware\Api\Seo\Event\SeoUrl;

use Shopware\Api\Seo\Collection\SeoUrlBasicCollection;
use Shopware\Context\Struct\TranslationContext;
use Shopware\Framework\Event\NestedEvent;

class SeoUrlBasicLoadedEvent extends NestedEvent
{
    public const NAME = 'seo_url.basic.loaded';

    /**
     * @var TranslationContext
     */
    protected $context;

    /**
     * @var SeoUrlBasicCollection
     */
    protected $seoUrls;

    public function __construct(SeoUrlBasicCollection $seoUrls, TranslationContext $context)
    {
        $this->context = $context;
        $this->seoUrls = $seoUrls;
    }

    public function getName(): string
    {
        return self::NAME;
    }

    public function getContext(): TranslationContext
    {
        return $this->context;
    }

    public function getSeoUrls(): SeoUrlBasicCollection
    {
        return $this->seoUrls;
    }
}
